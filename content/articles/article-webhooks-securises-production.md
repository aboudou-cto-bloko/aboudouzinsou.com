---
title: "Webhooks en production : signature HMAC, idempotence, retry — le guide complet"
format: article
status: published
description: "Un webhook sans vérification de signature est une porte ouverte. Un webhook sans idempotence est une transaction doublée en attente. Ce que ça veut dire en code."
tags: [webhook, hmac, sécurité, paiement, mobile-money, node, typescript, convex, idempotence, production]
date: 2026-06-11
created: 2026-06-11
updated: 2026-06-11
related:
  - article-mobile-money-benin
  - tutoriel-moneroo-nextjs-convex
  - article-comparatif-paiement-benin
---

# Webhooks en production : signature HMAC, idempotence, retry — le guide complet

Un webhook, c'est une requête POST que ton prestataire de paiement envoie à ton serveur pour te dire qu'un paiement a eu lieu.

N'importe qui peut envoyer une requête POST à ton serveur.

Si tu ne vérifies pas que la requête vient bien de ton prestataire — et non d'un tiers qui a trouvé ton URL — tu crédites des paiements qui n'ont jamais eu lieu.

---

## Les trois problèmes à résoudre

**1. L'authenticité.** Ce webhook vient-il vraiment de Moneroo/FedaPay — ou de quelqu'un qui a trouvé mon endpoint ?

**2. L'idempotence.** Ce webhook, je l'ai peut-être déjà reçu et traité. Les prestataires rejouent les webhooks en cas d'absence de réponse. Si je le traite deux fois, je crédite deux fois.

**3. La fiabilité.** Mon serveur peut être temporairement indisponible au moment où le webhook arrive. Comment ne pas perdre des confirmations de paiement ?

---

## 1. Vérifier la signature HMAC

Chaque prestataire de paiement signe ses webhooks avec une clé secrète partagée. La signature voyage dans un header HTTP — `x-moneroo-signature`, `x-fedapay-signature`, selon le prestataire.

Le processus de vérification :

```typescript
"use node"; // obligatoire dans Convex pour accéder à crypto

import * as crypto from "crypto";

export function verifySignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  // timingSafeEqual prévient les timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

Règle absolue : vérifie la signature **avant** de désérialiser le body. Ne jamais parser le JSON d'abord, vérifier ensuite — parce que la vérification HMAC s'applique sur le body brut, pas sur le JSON parsé.

```typescript
// Dans ton httpAction Convex
handler: httpAction(async (ctx, req) => {
  const rawBody = await req.text(); // body brut en premier
  const sig = req.headers.get("x-moneroo-signature") ?? "";

  if (!verifySignature(rawBody, sig, process.env.MONEROO_WEBHOOK_SECRET!)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const event = JSON.parse(rawBody); // parser après vérification seulement
  await ctx.runMutation(internal.webhooks.handle, { event });
  return new Response("OK", { status: 200 });
}),
```

---

## 2. L'idempotence — traiter le même événement une seule fois

Les prestataires de paiement rejouent les webhooks si ton serveur ne répond pas dans un délai court (souvent 5–30 secondes). Un webhook peut donc arriver deux fois, trois fois, pour le même paiement.

Si tu traites chaque réception, tu crédites plusieurs fois.

La solution : vérifier l'état de la commande **avant** de la traiter.

```typescript
// convex/webhooks/mutations.ts
export const handle = internalMutation({
  handler: async (ctx, { event }) => {
    if (event.type !== "payment.success") return;

    const order = await ctx.db
      .query("orders")
      .withIndex("by_payment_reference", (q) =>
        q.eq("paymentReference", event.data.id)
      )
      .first();

    // Idempotence : si la commande n'est pas en "pending", on ignore
    if (!order || order.status !== "pending") return;

    // Sinon on planifie la vérification et la confirmation
    await ctx.scheduler.runAfter(0, internal.payments.verifyAndConfirm, {
      orderId: order._id,
    });
  },
});
```

Le statut `pending` est la sentinelle. Une commande confirmée (`paid`) ou annulée (`cancelled`) ne peut plus être modifiée par un webhook rejoué.

---

## 3. Ne jamais croire le webhook seul

Le webhook dit que le paiement a réussi. Mais le webhook peut être rejoué, forgé, ou envoyé par erreur.

La règle : après avoir validé la signature et vérifié l'idempotence, appelle l'API du prestataire pour confirmer que le paiement existe vraiment.

```typescript
// convex/payments/actions.ts
"use node";

export const verifyAndConfirm = internalAction({
  handler: async (ctx, { orderId }) => {
    const order = await ctx.runQuery(internal.orders.get, { orderId });

    // Appel API de vérification
    const res = await fetch(
      `https://api.moneroo.io/v1/payments/${order.paymentReference}`,
      { headers: { Authorization: `Bearer ${process.env.MONEROO_SECRET_KEY}` } }
    );
    const { data } = await res.json();

    if (data.status === "success") {
      await ctx.runMutation(internal.orders.confirm, { orderId });
    } else {
      await ctx.runMutation(internal.orders.cancel, { orderId });
    }
  },
});
```

Deux passes. La signature dit que l'expéditeur est légitime. L'appel API dit que le paiement est réel.

---

## 4. Répondre 200 rapidement — traiter en background

Les prestataires attendent une réponse `200 OK` dans un délai court. Si ton serveur prend trop de temps à traiter le webhook (vérifications, mise à jour de base, envoi d'email), le prestataire considère que la livraison a échoué et rejoue le webhook.

La solution : répondre `200` immédiatement, déléguer le traitement en background.

```typescript
handler: httpAction(async (ctx, req) => {
  // Vérification signature (rapide)
  // ...

  const event = JSON.parse(rawBody);

  // Déléguer à une mutation — ne pas attendre
  await ctx.runMutation(internal.webhooks.handle, { event });

  // Répondre immédiatement
  return new Response("OK", { status: 200 });
}),
```

La mutation enregistre l'événement et planifie le traitement réel. Le traitement réel (vérification API, mise à jour commande, envoi de confirmation email) tourne en background via le scheduler.

---

## Les erreurs que j'ai faites

**Pas de `"use node"`.** Le module `crypto` n'est pas disponible sans cette directive dans Convex. Résultat : crash silencieux à la première tentative de vérification HMAC.

**`ctx.db` dans le httpAction.** Les httpActions Convex n'ont pas accès à `ctx.db` — uniquement à `ctx.runMutation` et `ctx.runQuery`. Résultat : erreur qui n'apparaît pas au moment de l'écriture du code, seulement à l'exécution.

**Parser le JSON avant de vérifier la signature.** La signature est calculée sur le body brut. Si tu normalises le JSON en le parsant puis en le re-sérialisant, les caractères peuvent changer et la vérification échoue.

**Pas de vérification de statut.** Le webhook est traité, la commande est confirmée — puis le webhook arrive une deuxième fois et la commande est confirmée à nouveau. Stock décrémenté deux fois. Facture double. Client confus.

---

## Le circuit complet en une image

```
Webhook arrive
    ↓
Vérification signature HMAC → 401 si invalide
    ↓
ctx.runMutation (rapide, enregistre l'événement)
    ↓
200 OK (immédiat)
    ↓
Mutation → vérification statut (idempotence)
    ↓
Scheduler → action → appel API de vérification
    ↓
Mutation → confirmation / annulation commande
```

Chaque étape peut être testée indépendamment. Chaque erreur est isolée.

---

*→ [Comment intégrer le Mobile Money sur son site — le flux complet](/articles/article-mobile-money-benin)*
*→ [Moneroo, FedaPay, CinetPay — comment choisir sa passerelle](/articles/article-comparatif-paiement-benin)*
*→ [Le tutoriel Next.js + Convex + Moneroo avec tout le code](/tutoriels/tutoriel-moneroo-nextjs-convex)*
