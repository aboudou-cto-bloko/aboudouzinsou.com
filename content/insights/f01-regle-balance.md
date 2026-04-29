---
title: "La règle F-01 — toute modification de solde = une transaction d'abord"
date: 2026-04-29
topic: paiements
order: 2
tags: [fintech, convex, audit, escrow, patterns]
related:
  - convex-query-mutation-action
  - convex-httaction-interdit-db
  - xof-pas-de-centimes
status: published
---

# La règle F-01 — toute modification de solde = une transaction d'abord

Sur [Pixel-Mart](https://pixel-mart-bj.com), toutes les mutations financières respectent une règle. Une seule, mais non négociable.

**F-01 :**

> Toute modification de solde DOIT créer une transaction dans la même mutation, avant le `patch` du store.

```typescript
// Ordre obligatoire — jamais l'inverse
await ctx.db.insert("transactions", {
  storeId,
  type: "credit",
  direction: "credit",
  amount: releaseAmount,
  status: "completed",
  balanceBefore: store.balance,
  balanceAfter: store.balance + releaseAmount,
});

// APRÈS l'insert — jamais avant
await ctx.db.patch(storeId, { balance: store.balance + releaseAmount });
```

---

## Pourquoi l'ordre est critique

Dans Convex, les mutations sont transactionnelles. Si l'une des opérations échoue, tout est rollbacké.

**Si tu patches le solde en premier** et que l'insert de transaction échoue après — le solde a changé sans trace. Impossible à auditer.

**Si tu insères la transaction en premier** et que le patch échoue — les deux opérations sont rollbackées ensemble. État cohérent.

La transaction est la source de vérité. Le solde en est la projection calculée.

---

## Pourquoi ça vaut son poids en production

La PR #250 sur Pixel-Mart l'a confirmé.

Un bug de webhook payout avait potentiellement laissé des soldes vendeurs incorrects. La correction a pu être automatisée parce que toutes les mutations légitimes avaient respecté F-01.

La formule d'audit :

```
balance_attendu =
  + sum(type=credit, direction=credit, status=completed)
  - sum(type=payout, direction=debit,  status=pending|completed)
```

Cette formule n'est calculable que si les transactions existent pour chaque changement de solde. Sans F-01 — pas d'audit possible.

---

La règle est simple. Elle sépare une app qui peut se corriger toute seule d'une app qui accumule de la dette comptable silencieuse.
