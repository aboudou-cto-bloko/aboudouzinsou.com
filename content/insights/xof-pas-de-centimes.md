---
title: "XOF n'a pas de centimes — le bug qui m'a coûté 3h"
date: 2026-04-29
topic: paiements
order: 1
tags: [moneroo, xof, devises, bug, afrique]
tldr: "XOF, XAF, GNF, CDF n'ont pas de sous-unité. 5 000 FCFA = 5000, pas 500000. Le réflexe Stripe (montants en centimes) est le bug numéro un à l'intégration d'une API de paiement africaine."
takeaways:
  - "Utiliser `toMonerooAmount(amount, currency)` — retourne le montant direct pour les devises sans centimes"
  - "`Intl.NumberFormat('fr-FR', {currency: 'XOF', minimumFractionDigits: 0})` pour l'affichage en FCFA"
related:
  - f01-regle-balance
status: published
---

# XOF n'a pas de centimes — le bug qui m'a coûté 3h

Quand tu travailles avec des APIs de paiement européennes ou américaines, les montants s'envoient en **centimes**.

5 € → tu envoies `500`.
Un café à 1,50 € → tu envoies `150`.

C'est une convention pour éviter les flottants dans les calculs financiers.

Le problème : j'avais pris cette habitude. Et quand j'ai intégré Moneroo pour la première fois, j'ai fait pareil.

5 000 FCFA → j'ai envoyé `500000`.

Résultat : le lien de paiement affichait **500 000 FCFA**. Pas 5 000.

---

Le XOF — et plusieurs devises africaines — n'ont pas de subdivision en centimes. 5 000 FCFA c'est 5 000. Pas 50 FCFA. Pas 500 000 FCFA. 5 000.

Les devises concernées : `XOF`, `XAF`, `GNF`, `CDF`.

Depuis, j'ai une fonction dans tous mes projets Moneroo :

```typescript
const NO_SUBUNIT = ["XOF", "XAF", "GNF", "CDF"];

function toMonerooAmount(amount: number, currency: string): number {
  return NO_SUBUNIT.includes(currency) ? amount : Math.round(amount / 100);
}

function formatPrice(amount: number, currency = "XOF"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}
// formatPrice(5000, "XOF") → "5 000 FCFA"
```

Si la devise est dans `NO_SUBUNIT`, le montant que tu as en base est déjà le bon. Tu n'as rien à diviser.

Mémo : XOF ne divise jamais.
