---
title: "Convex internal vs public : sécuriser ses fonctions et ne pas tout exposer"
date: 2026-04-29
topic: convex
order: 3
tags: [convex, sécurité, backend, typescript]
related:
  - convex-query-mutation-action
  - convex-httaction-interdit-db
  - f01-regle-balance
status: published
---

# Convex : internal vs public — ne pas exposer ce qu'on n'a pas à exposer

Par défaut, toute fonction Convex exportée avec `export const` est accessible depuis le frontend.

```typescript
export const confirmPayment = mutation({ ... })
// → n'importe qui peut appeler api.payments.confirmPayment depuis le navigateur
```

Pour une fonction de confirmation de paiement, c'est un problème. Tu ne veux pas qu'un utilisateur puisse appeler ça directement depuis la console de son navigateur.

---

La distinction est simple :

```typescript
// Accessible depuis le frontend — pour les vraies interactions utilisateur
export const getMyOrders = query({ ... });

// Accessible uniquement depuis le backend Convex — jamais depuis le client
export const confirmPayment = internalMutation({ ... });
export const sendNotification = internalAction({ ... });
```

La règle : tout ce qui modifie des données financières, des statuts critiques, ou des accès utilisateur → `internal`.

L'appel depuis le backend :

```typescript
await ctx.runMutation(internal.payments.confirmPayment, { orderId });
// internal. au lieu de api.
```

`api.` → frontend peut appeler.
`internal.` → backend seulement.

Si tu hésites entre les deux : demande-toi si tu serais à l'aise qu'un utilisateur curieux l'appelle depuis sa console. Si non — c'est `internal`.
