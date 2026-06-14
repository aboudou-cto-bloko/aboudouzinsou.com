---
title: "Comment intégrer le paiement Mobile Money MTN et Moov sur son site web au Bénin"
format: article
status: published
description: "Ajouter le Mobile Money sur un site web béninois n'est pas une configuration. C'est un circuit asynchrone avec des dizaines de cas d'erreur. Ce que ça implique vraiment."
tldr: "Le Mobile Money n'est pas Stripe. C'est un circuit asynchrone en 10 étapes où chacune peut planter. Mutation → action → API → webhook → vérification → confirmation. Gérer les cas edge (centimes XOF, idempotence, double confirmation) sépare une boutique fonctionnelle d'une vitrine qui collecte parfois de l'argent."
takeaways:
  - "XOF n'a pas de centimes — envoyer 5000 et non 500000 pour 5 000 FCFA"
  - "Les mutations Convex ne peuvent pas faire d'appels HTTP — déléguer à une action via le scheduler"
  - "Vérifier la signature HMAC avant de parser le body — jamais l'inverse"
  - "Ne jamais créditer sur la seule foi du webhook — appeler l'API de vérification en plus"
  - "Vérifier le statut de la commande avant de traiter pour éviter les doubles confirmations"
tags: [bénin, cotonou, mobile-money, mtn, moov, paiement, api, développeur, nextjs, convex, moneroo, webhook]
date: 2026-05-20
created: 2026-05-20
updated: 2026-05-20
---

# Intégrer le paiement Mobile Money sur son site au Bénin — ce que le bouton cache

La première intégration MTN Mobile Money que j'ai faite, j'ai envoyé 50 000 au lieu de 5 000 FCFA.

Le client a failli payer dix fois le prix de sa commande.

Ce n'est pas un bug de code. C'est un bug de culture monétaire. Les APIs européennes attendent les montants en centimes (5 € = 500). Le XOF n'a pas de centimes. 5 000 FCFA = 5000. Pas 500000.

Personne ne te dit ça dans un tutoriel Stripe.

---

## Le Mobile Money n'est pas Stripe

Stripe est synchrone. Tu appelles l'API, tu obtiens une réponse, tu confirmes la commande.

Le Mobile Money est asynchrone. Le client initie le paiement sur ton site. Il reçoit une notification USSD sur son téléphone. Il confirme — ou il ne confirme pas. L'opérateur te le dit plus tard, via webhook.

Plus tard peut vouloir dire 3 secondes. Ou 45 secondes. Ou jamais, si le client abandonne à mi-chemin.

Ton site doit gérer tout ça sans bloquer, sans créditer ce qui n'a pas été payé, sans perdre les paiements valides qui arrivent avec du retard.

C'est pour ça que "ajouter le Mobile Money" n'est pas une configuration. C'est un circuit.

---

## Le flux réel — étape par étape

Sur [Pixel-Mart](https://pixel-mart-bj.com) et PLR Library, voici ce qui se passe quand un client clique "Payer" :

```
1. Frontend → crée la commande en base (mutation)
2. Mutation → planifie l'appel API (action)
3. Action → appelle l'API Moneroo → reçoit un checkout_url
4. Checkout_url stocké en base
5. Frontend surveille la commande → dès que checkout_url arrive, redirige
6. Client paie sur la page Moneroo (USSD MTN / Moov)
7. Moneroo → envoie un webhook POST à ton serveur
8. Ton serveur → vérifie la signature HMAC
9. → appelle l'API de vérification (ne jamais croire le webhook seul)
10. → si confirmation : commande passée à "payée"
```

Dix étapes. Chacune peut planter.

---

## Pourquoi la mutation ne peut pas appeler l'API

Si tu utilises Convex (et c'est la bonne décision pour ce type de flux), tu vas vite rencontrer une contrainte non-négociable :

**Les mutations Convex ne peuvent pas faire d'appels HTTP.**

La mutation crée la commande. Elle délègue l'appel API à une action interne via le scheduler.

```typescript
// convex/orders/mutations.ts
export const create = mutation({
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      ...args,
      status: "pending",
    });

    // Jamais directement dans la mutation
    await ctx.scheduler.runAfter(0, internal.payments.initiate, { orderId });
    return orderId;
  },
});
```

L'action fait l'appel réseau :

```typescript
// convex/payments/actions.ts
"use node"; // obligatoire — crypto ne fonctionne pas sans ça

export const initiate = internalAction({
  handler: async (ctx, { orderId }) => {
    const order = await ctx.runQuery(internal.orders.get, { orderId });

    const res = await fetch("https://api.moneroo.io/v1/payments/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.MONEROO_SECRET_KEY}` },
      body: JSON.stringify({
        amount: order.totalAmount, // XOF : montant direct, pas de centimes
        currency: "XOF",
        customer: { email: order.customerEmail },
        return_url: `${process.env.NEXT_PUBLIC_URL}/orders/${orderId}/confirmation`,
        metadata: { orderId },
      }),
    });

    const { data } = await res.json();
    await ctx.runMutation(internal.orders.setPaymentData, {
      orderId,
      paymentUrl: data.checkout_url,
    });
  },
});
```

Le frontend surveille la commande en temps réel via `useQuery` et redirige dès que le lien est disponible. Pas de polling. Pas de setTimeout. Convex gère la réactivité.

---

## La règle XOF — écrite dans le code

Ce bug est assez fréquent pour mériter une fonction dédiée.

```typescript
// convex/lib/currency.ts
const NO_SUBUNIT = ["XOF", "XAF", "GNF", "CDF"];

export function toMonerooAmount(amount: number, currency: string): number {
  return NO_SUBUNIT.includes(currency) ? amount : Math.round(amount / 100);
}
```

Un `toMonerooAmount(5000, "XOF")` renvoie `5000`.  
Un `toMonerooAmount(500, "EUR")` renvoie `5`.

La règle est dans le code, pas dans ta mémoire.

---

## Vérifier le webhook — deux fois, pas une

Un webhook peut être :
- Rejoué par l'opérateur (retard réseau, retry automatique)
- Reçu deux fois pour le même paiement
- Forgé par un tiers si tu ne vérifies pas la signature

La signature d'abord, toujours.

```typescript
// convex/http.ts
http.route({
  path: "/webhooks/moneroo",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const rawBody = await req.text();
    const signature = req.headers.get("x-moneroo-signature") ?? "";

    if (!verifySignature(rawBody, signature)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const event = JSON.parse(rawBody);
    await ctx.runMutation(internal.webhooks.handle, { event });
    return new Response("OK", { status: 200 });
  }),
});

function verifySignature(body: string, sig: string): boolean {
  const expected = crypto
    .createHmac("sha256", process.env.MONEROO_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}
```

Ensuite, même si la signature est valide, on ne crédite pas sur la seule foi du webhook. On rappelle l'API pour vérifier que le paiement existe vraiment.

```typescript
// Dans la mutation webhook
if (event.type === "payment.success") {
  const order = await ctx.db
    .query("orders")
    .withIndex("by_payment_reference", (q) =>
      q.eq("paymentReference", event.data.id)
    )
    .first();

  // Idempotence : ignorer si déjà traité
  if (!order || order.status !== "pending") return;

  await ctx.scheduler.runAfter(0, internal.payments.verifyAndConfirm, {
    orderId: order._id,
  });
}
```

Deux passes. La signature dit que l'expéditeur est Moneroo. L'appel API dit que le paiement est réel.

---

## Les erreurs que j'ai faites avant d'avoir ce circuit

**Le bug des centimes.** Montant multiplié par 100 sur du XOF. Corrigé par `toMonerooAmount()`.

**La mutation qui appelle HTTP.** Convex plante silencieusement. Corrigé par le pattern mutation → scheduler → action.

**Le webhook traité sans vérification.** N'importe qui peut envoyer un POST à ton endpoint. Corrigé par HMAC.

**La double confirmation.** Webhook reçu deux fois → commande confirmée deux fois → stock décrémenté deux fois. Corrigé par la vérification `status !== "pending"` avant de traiter.

**`"use node"` oublié.** L'action importe `crypto` → crash. Corrigé en mettant la directive en première ligne du fichier.

---

## Ce que ça coûte de ne pas gérer ces cas

Un paiement valide refusé : le client ne revient pas.

Une commande créditée sans paiement réel : tu livres à perte.

Un webhook traité deux fois : stock faux, facture double, client confus.

Sur Pixel-Mart, la gestion de ces cas edge a pris autant de temps que le reste du tunnel de commande. Ce n'est pas de la sur-ingénierie. C'est ce qui sépare une boutique en ligne d'une vitrine qui collecte parfois de l'argent.

---

Le Mobile Money n'est pas difficile. Il est juste asynchrone dans un monde où on pense synchrone.

Une fois le circuit en place — mutation, action, webhook, vérification — il tourne sans intervention. Et les paiements MTN à 3h du matin arrivent comme les autres.

---

*→ [Le tutoriel complet avec tout le code : Next.js + Convex + Moneroo](/tutoriels/tutoriel-moneroo-nextjs-convex)*
*→ [Pourquoi le Mobile Money n'est pas une option pour un e-commerce béninois](/articles/article-ecommerce-benin)*
*→ [Ce que coûte vraiment l'intégration paiement dans un devis](/articles/article-cout-site-web-benin)*
