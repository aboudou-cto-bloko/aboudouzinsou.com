---
title: "SDK TypeScript Moneroo : intégrer les paiements Mobile Money en JavaScript"
format: article
status: published
description: "Il n'existait pas de SDK TypeScript pour Moneroo. J'ai construit le package npm officieux — zéro dépendance, dual ESM/CJS, TypeScript strict, vérification HMAC des webhooks incluse."
tldr: "Le SDK TypeScript Moneroo comble un manque réel : plus besoin de gérer les headers, les erreurs et la vérification HMAC à la main. Zéro dépendance, Node 18+, dual ESM/CJS, tout typé. Une intégration qui se réduit à la logique métier."
takeaways:
  - "Installer avec npm install moneroo — zéro dépendance, Node 18+ suffit"
  - "XOF n'a pas de centimes : passer 5000 et non 500000 pour 5 000 FCFA"
  - "webhooks.constructEvent() vérifie la signature HMAC et lance une erreur si invalide"
  - "Ne jamais créditer sur le seul webhook — toujours appeler payments.verify() en plus"
tags: [moneroo, sdk, typescript, npm, afrique, paiement, open-source]
github: https://github.com/aboudou-cto-bloko/moneroo-tools
npm: https://www.npmjs.com/package/moneroo
date: 2026-04-29
created: 2026-04-29
updated: 2026-04-29
---

# Il n'existait pas de SDK TypeScript pour Moneroo. Alors je l'ai construit.

Moneroo est une API de paiement africaine — Mobile Money, cartes, plusieurs pays, devises locales (XOF, XAF...).

Si tu construis un produit pour le marché africain francophone, c'est l'une des rares options sérieuses. Le problème : aucun SDK TypeScript n'existait.

Pour intégrer Moneroo dans un projet Node.js, la seule option c'était l'API REST à la main. Gérer les headers d'autorisation. Parser les erreurs. Implémenter la vérification HMAC des webhooks toi-même. Sans types, sans autocomplétion, sans filet de sécurité.

Alors j'ai construit le SDK.

---

## Ce que c'est

[`moneroo`](https://www.npmjs.com/package/moneroo) — v0.1.1 — disponible sur npm.

Code source : [github.com/aboudou-cto-bloko/moneroo-tools](https://github.com/aboudou-cto-bloko/moneroo-tools)

```bash
npm install moneroo
```

**Zéro dépendance externe.** Node.js 18+ a `fetch` nativement et `node:crypto` pour les webhooks. Pas besoin d'axios, pas de node-fetch, pas de bibliotèques crypto tierces.

---

## Comment ça s'utilise

```typescript
import { Moneroo } from 'moneroo';

const moneroo = new Moneroo({
  secretKey: process.env.MONEROO_SECRET_KEY!,
  webhookSecret: process.env.MONEROO_WEBHOOK_SECRET,
});
```

**Initialiser un paiement :**

```typescript
const { data } = await moneroo.payments.initialize({
  amount: 5000,     // XOF — pas de centimes (voir note ci-dessous)
  currency: 'XOF',
  description: 'Commande #123',
  return_url: 'https://monapp.com/confirmation',
  customer: {
    email: 'client@example.com',
    first_name: 'Koffi',
  },
});

// Rediriger vers data.checkout_url
```

> **Note XOF :** les devises d'Afrique de l'Ouest (XOF, XAF, GNF, CDF) n'ont pas de sous-unité. 5 000 FCFA = `5000`. Pas `500000`. C'est une erreur que font tous ceux qui viennent de Stripe ou PayPal. [L'insight complet sur ce bug →](./insight-xof-pas-de-centimes.md)

**Vérifier un paiement avant de créditer :**

```typescript
const { data } = await moneroo.payments.verify('pay_xxx');
if (data.status === 'success') {
  // créditer — jamais sur le seul webhook
}
```

**Webhooks — vérification de signature :**

```typescript
const event = moneroo.webhooks.constructEvent(rawBody, signature);
// Lance une erreur si la signature est invalide
// event.type === 'payment.success'
```

---

## Les décisions d'architecture

**Zéro dépendance.** Node 18 a tout ce qu'il faut. Une dépendance de moins c'est un vecteur de failles potentielles en moins, un fichier `node_modules` plus léger, et une surface de maintenance réduite.

**Dual export ESM + CJS.** Que tu sois sur un projet ESM moderne ou un setup CommonJS legacy — ça marche sans configuration.

```json
"exports": {
  ".": {
    "import": "./dist/esm/index.js",
    "require": "./dist/cjs/index.cjs",
    "types": "./dist/types/index.d.ts"
  }
}
```

**TypeScript strict partout.** Les méthodes de paiement acceptées (`mtn_bj`, `wave_sn`, `orange_ci`...), les statuts de transaction, les structures de payout — tout est typé. Pas de `any` dans les données critiques.

---

## Ce que ça change en pratique

Avec le SDK, le code Moneroo dans un projet Next.js + Convex se réduit à la logique métier. Les headers, le parsing d'erreurs, la vérification HMAC — tout ça disparaît.

Si tu veux voir comment intégrer ce SDK dans un flux de paiement complet Next.js + Convex (mutation → action → webhook → confirmation), le tutoriel complet est ici : [Intégrer Moneroo dans Next.js + Convex →](./tutoriel-moneroo-nextjs-convex.md)

---

## Monorepo

Le SDK vit dans `moneroo-tools` — un monorepo pnpm avec deux packages :

```
moneroo-tools/
├── packages/sdk/   → moneroo v0.1.1
└── packages/mcp/   → moneroo-mcp v0.4.2
```

Le deuxième package, c'est un serveur MCP — une interface complètement différente pour piloter Moneroo depuis un assistant IA en langage naturel. [Ce que ça permet →](./article-sdk-vers-mcp.md)

---

C'est v0.1.1. Paiements, payouts, webhooks sont couverts. Si tu tombes sur un cas edge non géré — [ouvre une issue](https://github.com/aboudou-cto-bloko/moneroo-tools/issues).
