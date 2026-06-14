---
title: "Intégrer Moneroo dans Next.js + Convex — du lien de paiement au webhook"
format: tutoriel
status: draft
tags: [moneroo, convex, nextjs, paiement, xof, webhook, typescript]
tldr: "Flux Moneroo complet dans Next.js + Convex : mutation crée la commande → action scheduler initialise le paiement → Moneroo → httpAction reçoit le webhook → mutation de confirmation. Chaque étape fait une chose, chaque panne est isolable."
takeaways:
  - "XOF sans centimes : `amount: 5000` pour 5 000 FCFA — jamais 500000"
  - "La mutation ne peut pas appeler HTTP — `ctx.scheduler.runAfter(0, internal.payments.initiate, { orderId })`"
  - "Vérifier la signature HMAC sur le body brut AVANT de JSON.parse — jamais l'inverse"
  - "Ne jamais créditer sur le seul webhook — toujours appeler l'API de vérification en plus"
  - "Vérifier `order.status === 'pending'` avant de traiter — idempotence contre les webhooks rejoués"
github: https://pixel-mart-bj.com
npm: https://www.npmjs.com/package/moneroo
created: 2026-04-29
updated: 2026-04-29
---

# Intégrer Moneroo dans Next.js + Convex — du lien de paiement au webhook

Il n'existe aucun guide complet de Moneroo pour Next.js + Convex.

J'ai intégré Moneroo sur trois projets différents dont [Pixel-Mart](https://pixel-mart-bj.com). À chaque fois j'ai retrouvé les mêmes problèmes, les mêmes bugs, les mêmes questions sans réponse. Ce tutoriel est ce que j'aurais voulu trouver au départ.

> **Prérequis :** Ce tutoriel utilise le SDK [`moneroo`](https://www.npmjs.com/package/moneroo) — le SDK TypeScript officiel. Si tu ne l'as pas encore : [présentation du SDK →](./article-moneroo-sdk.md). Pour comprendre la distinction mutation / action dans Convex (utilisée partout ici) : [Convex — query, mutation, action →](./insight-convex-query-mutation-action.md)

On va couvrir le flux complet :
→ Créer un lien de paiement
→ Rediriger l'utilisateur
→ Recevoir le webhook de confirmation
→ Vérifier le paiement avant de créditer quoi que ce soit

---

## Ce qu'on construit

Une commande est créée. L'utilisateur paie via Moneroo (Mobile Money, carte...). Moneroo nous prévient quand c'est fait. On confirme.

Ce n'est pas un exemple jouet — c'est le flux exact utilisé en production sur [Pixel-Mart](https://pixel-mart-bj.com).

---

## Prérequis

- Un compte Moneroo avec une clé API
- Un projet Next.js avec Convex configuré
- Les variables d'environnement : `MONEROO_SECRET_KEY`, `MONEROO_WEBHOOK_SECRET`

---

## 1. La règle des devises — avant tout le reste

Si tu travailles avec du XOF (Franc CFA), retiens ça maintenant :

> XOF n'a pas de centimes. 5 000 FCFA = 5000. Pas 500000.

Les APIs européennes attendent les montants en centimes (5 € → `500`). Moneroo pour XOF attend le montant tel quel (5 000 FCFA → `5000`).

```typescript
// convex/lib/currency.ts
const NO_SUBUNIT = ["XOF", "XAF", "GNF", "CDF"];

export function toMonerooAmount(amount: number, currency: string): number {
  // XOF : on envoie le montant direct
  // EUR : on divise par 100 (centimes → unités)
  return NO_SUBUNIT.includes(currency) ? amount : Math.round(amount / 100);
}
```

---

## 2. Le flux complet

```
Frontend → mutation createOrder
         → action initiatePayment → Moneroo API
         → retour : payment_url
Frontend redirige vers payment_url
Moneroo → webhook POST /api/webhooks/moneroo
         → httpAction vérifie signature
         → mutation confirmPayment
```

Mutation → Action → Moneroo → Webhook → Mutation. C'est important de voir ça comme un circuit, pas comme une seule opération.

---

## 3. Créer la commande et initier le paiement

La mutation crée la commande en base et délègue l'appel API à une action.

```typescript
// convex/orders/mutations.ts
export const create = mutation({
  args: {
    items: v.array(v.object({ productId: v.id("products"), quantity: v.number() })),
    customerEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });

    // Déléguer l'appel Moneroo à une action — jamais dans une mutation
    await ctx.scheduler.runAfter(0, internal.payments.initiate, { orderId });
    return orderId;
  },
});
```

L'action parle à Moneroo et stocke le lien de paiement.

```typescript
// convex/payments/actions.ts
"use node"; // nécessaire pour les appels HTTP

export const initiate = internalAction({
  args: { orderId: v.id("orders") },
  handler: async (ctx, { orderId }) => {
    const order = await ctx.runQuery(internal.orders.get, { orderId });

    const response = await fetch("https://api.moneroo.io/v1/payments/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MONEROO_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: order.totalAmount, // en FCFA, pas en centimes
        currency: "XOF",
        description: `Commande #${orderId}`,
        customer: { email: order.customerEmail },
        return_url: `${process.env.NEXT_PUBLIC_URL}/orders/${orderId}/confirmation`,
        metadata: { orderId },
      }),
    });

    const { data } = await response.json();

    // Stocker la référence et le lien de paiement
    await ctx.runMutation(internal.orders.setPaymentData, {
      orderId,
      paymentReference: data.id,
      paymentUrl: data.checkout_url,
    });
  },
});
```

Du côté frontend, on attend que le lien soit prêt puis on redirige :

```typescript
// src/app/checkout/page.tsx
"use client";
export default function CheckoutPage() {
  const createOrder = useMutation(api.orders.create);
  const [orderId, setOrderId] = useState<Id<"orders"> | null>(null);
  const order = useQuery(api.orders.get, orderId ? { orderId } : "skip");

  // Dès que le lien est disponible, on redirige
  useEffect(() => {
    if (order?.paymentUrl) {
      window.location.href = order.paymentUrl;
    }
  }, [order?.paymentUrl]);

  async function handleCheckout() {
    const id = await createOrder({ items, customerEmail });
    setOrderId(id);
  }

  return <button onClick={handleCheckout}>Payer</button>;
}
```

---

## 4. Recevoir le webhook

Moneroo envoie une notification HTTP quand le paiement aboutit. On la reçoit dans un `httpAction` Convex.

```typescript
// convex/http.ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import crypto from "node:crypto";

const http = httpRouter();

http.route({
  path: "/webhooks/moneroo",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const rawBody = await req.text();
    const signature = req.headers.get("x-moneroo-signature") ?? "";

    // Vérifier la signature AVANT de faire quoi que ce soit
    if (!verifySignature(rawBody, signature)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // Déléguer le traitement à une mutation (httpAction ne peut pas écrire directement)
    await ctx.runMutation(internal.webhooks.handle, { event });

    return new Response("OK", { status: 200 });
  }),
});

function verifySignature(body: string, signature: string): boolean {
  const expected = crypto
    .createHmac("sha256", process.env.MONEROO_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

export default http;
```

Deux règles dans cet ordre, sans exception :
1. Vérifier la signature
2. Passer à la mutation

Si tu inverses — tu traites des données non vérifiées.

---

## 5. Traiter le webhook — et vérifier une seconde fois

```typescript
// convex/webhooks/mutations.ts
export const handle = internalMutation({
  args: { event: v.any() },
  handler: async (ctx, { event }) => {
    if (event.type === "payment.success") {
      // Trouver la commande par référence de paiement
      const order = await ctx.db
        .query("orders")
        .withIndex("by_payment_reference", (q) =>
          q.eq("paymentReference", event.data.id)
        )
        .first();

      if (!order || order.status !== "pending") return;

      // Planifier une vérification via l'API avant de confirmer
      // → ne jamais créditer sur la seule foi du webhook
      await ctx.scheduler.runAfter(0, internal.payments.verifyAndConfirm, {
        orderId: order._id,
      });
    }
  },
});
```

Pourquoi vérifier une seconde fois ? Parce qu'un webhook peut être rejoué, retardé, ou forgé. L'appel API de vérification confirme que le paiement existe vraiment côté Moneroo.

```typescript
// convex/payments/actions.ts
export const verifyAndConfirm = internalAction({
  args: { orderId: v.id("orders") },
  handler: async (ctx, { orderId }) => {
    const order = await ctx.runQuery(internal.orders.get, { orderId });

    const response = await fetch(
      `https://api.moneroo.io/v1/payments/${order.paymentReference}/verify`,
      {
        headers: { Authorization: `Bearer ${process.env.MONEROO_SECRET_KEY}` },
      }
    );
    const { data } = await response.json();

    if (data.status === "success") {
      await ctx.runMutation(internal.orders.confirm, { orderId });
    }
  },
});
```

---

## 6. Confirmer la commande

```typescript
// convex/orders/mutations.ts
export const confirm = internalMutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, { orderId }) => {
    await ctx.db.patch(orderId, {
      status: "paid",
      paidAt: Date.now(),
    });

    // Notifier le vendeur, déclencher la préparation, etc.
    await ctx.scheduler.runAfter(0, internal.notifications.orderPaid, { orderId });
  },
});
```

---

## Ce qu'on a construit

```
Commande créée → mutation
Paiement initié → action (via scheduler)
Utilisateur paie sur Moneroo
Moneroo notifie → httpAction
Signature vérifiée → mutation
Paiement vérifié via API → action
Commande confirmée → mutation
```

Chaque étape fait une chose. Si l'une plante, les autres ne sont pas affectées — et tu sais exactement où regarder.

---

## Les erreurs que j'ai faites (et que tu vas éviter)

— Envoyer `50000` au lieu de `5000` FCFA → le bug des centimes XOF. [Insight complet →](./insight-xof-pas-de-centimes.md)
— Appeler Moneroo directement dans une mutation → transaction Convex bloquée. [Pourquoi mutation ≠ appel HTTP →](./insight-convex-query-mutation-action.md)
— Confirmer sur le webhook sans vérifier → risque de fausse confirmation. [httpAction et ctx.db →](./insight-convex-httaction-interdit-db.md)
— Oublier `"use node"` dans l'action → crash à l'import de `crypto`
— Ne pas configurer `httpRouter` dans `convex/http.ts` → webhook jamais reçu
— Exposer `confirmPayment` comme mutation publique → appelable depuis la console navigateur. [internal vs public →](./insight-convex-internal-vs-public.md)

---

Si tu construis quelque chose avec Moneroo + Convex et que tu bloques sur un point précis — dis-le moi.

---

*→ Le SDK Moneroo qui simplifie tout ce code : [présentation du SDK](./article-moneroo-sdk.md)*
*→ Piloter Moneroo depuis Claude en langage naturel : [Du SDK au MCP](./article-sdk-vers-mcp.md)*
*→ Les règles financières qui protègent les soldes vendeurs : [La règle F-01](./insight-f01-regle-balance.md)*
