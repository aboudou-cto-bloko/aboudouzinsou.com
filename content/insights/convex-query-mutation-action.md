---
title: "Convex query vs mutation vs action : différences, usages et quand utiliser chaque type"
date: 2026-04-29
topic: convex
order: 1
tags: [convex, backend, typescript]
tldr: "Query = fenêtre réactive (pas d'écriture). Mutation = transaction tout-ou-rien (pas d'appel réseau). Action = appels externes (pas de ctx.db). Le pattern correct pour un paiement : mutation crée → scheduler → action appelle → mutation confirme."
takeaways:
  - "Ne jamais appeler une API externe dans une mutation — si ça plante, commande créée sans paiement initié"
  - "mutation → ctx.scheduler.runAfter(0, internal.X) → action → ctx.runMutation : chaque étape fait une seule chose"
related:
  - convex-httaction-interdit-db
  - convex-internal-vs-public
status: published
---

# Convex : query, mutation, action — la vraie différence

J'ai mis du temps à vraiment comprendre ça. Pas le concept — le concept est simple. Mais *pourquoi* les règles sont là.

Voilà comment je le pense maintenant.

**Une query, c'est une fenêtre.**
Elle regarde. Elle ne touche à rien. Tu peux l'ouvrir 50 fois en même temps, ça ne pose aucun problème. Et Convex la met à jour tout seul quand les données changent — c'est le côté réactif.

**Une mutation, c'est une transaction.**
Elle écrit dans la base. Tout ou rien. Si quelque chose plante en plein milieu, rien n'est sauvegardé. C'est sûr par design.

**Une action, c'est le dehors.**
Elle peut appeler une API externe — Moneroo, Resend, n'importe quoi. En échange : elle n'a pas accès direct à la base de données.

---

La règle qui découle de ça, et que j'aurais voulu lire dès le départ :

> N'appelle jamais une API externe dans une mutation.

Si ça plante au milieu — réseau coupé, timeout — tu te retrouves avec une commande créée en base mais aucun paiement initié. Ou l'inverse.

Le bon pattern : mutation → action → mutation.

```typescript
// La mutation crée la commande et délègue le reste
export const createOrder = mutation({
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", { ...args, status: "pending" });
    await ctx.scheduler.runAfter(0, internal.payments.initiate, { orderId });
    return orderId;
  }
});

// L'action parle à Moneroo, puis re-mute
export const initiate = internalAction({
  handler: async (ctx, { orderId }) => {
    const link = await moneroo.payments.initialize({ ... });
    await ctx.runMutation(internal.orders.setPaymentLink, { orderId, link });
  }
});
```

Mutation crée. Action appelle. Mutation confirme. Chaque étape fait une seule chose.

C'est plus de code. Mais chaque panne devient gérable — tu sais exactement où ça a cassé.
