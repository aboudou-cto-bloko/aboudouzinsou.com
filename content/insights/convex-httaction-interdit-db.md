---
title: "Convex httpAction : pourquoi ctx.db est inaccessible et comment contourner"
date: 2026-04-29
topic: convex
order: 2
tags: [convex, webhook, httpaction, backend]
tldr: "Un httpAction Convex vit en dehors du système transactionnel — il ne peut pas écrire directement en base. Il reçoit, vérifie la signature, puis délègue à une internalMutation."
takeaways:
  - "httpAction → ctx.runMutation uniquement, jamais ctx.db.insert directement"
  - "Vérifier la signature AVANT ctx.runMutation — ne jamais écrire des données non vérifiées"
related:
  - convex-query-mutation-action
  - convex-internal-vs-public
status: published
---

# httpAction et ctx.db : pourquoi ça ne marche pas

Tu reçois un webhook — Moneroo, Stripe, peu importe. Tu veux enregistrer l'événement direct en base. Logique, non ?

```typescript
// Ce qu'on voudrait faire
http.route({
  path: "/webhooks/payment",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const data = await req.json();
    await ctx.db.insert("events", data); // ❌ Erreur
  })
});
```

Ça plante. Et le message d'erreur n'est pas très clair la première fois.

---

Le pourquoi : un `httpAction` vit en dehors du système transactionnel de Convex. Il peut recevoir des requêtes HTTP, lire les headers, parser le body — mais il ne peut pas écrire directement en base.

Pour écrire, il doit passer par une mutation.

```typescript
http.route({
  path: "/webhooks/payment",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const rawBody = await req.text();

    // Vérifier la signature d'abord
    const signature = req.headers.get("x-moneroo-signature") ?? "";
    if (!verifySignature(rawBody, signature)) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Déléguer l'écriture à une mutation
    await ctx.runMutation(internal.webhooks.handle, JSON.parse(rawBody));
    return new Response("OK", { status: 200 });
  })
});
```

La répartition des rôles :
— `httpAction` : reçoit, vérifie, transmet
— `mutation` : écrit en base, de façon transactionnelle

**Vérifie toujours la signature avant de `runMutation`.** Si tu délègues d'abord et vérifies après, tu as déjà écrit des données non vérifiées en base.
