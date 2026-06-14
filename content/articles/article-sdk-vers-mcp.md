---
title: "Serveur MCP Moneroo : connecter les paiements Mobile Money aux agents IA Claude"
format: article
status: draft
description: "Même API Moneroo, deux interfaces complètement différentes. Le SDK pour les développeurs qui intègrent dans du code. Le serveur MCP pour piloter Moneroo depuis un assistant IA en langage naturel."
tldr: "Le SDK Moneroo et le serveur MCP ne font pas la même chose. Le SDK est pour les développeurs qui codent. Le MCP expose 28 outils Moneroo à Claude, Cursor, Windsurf — en langage naturel. Le MCP est construit sur le SDK, pas à côté."
takeaways:
  - "SDK : tu construis une app qui intègre Moneroo via du code TypeScript"
  - "MCP : tu interroges Moneroo depuis Claude en langage naturel sans écrire de code"
  - "Le MCP expose 28 outils en 6 catégories : paiements, payouts, analytics, insights, automations, exports"
  - "Setup Claude Desktop : ajouter moneroo-mcp dans mcpServers avec la clé API en variable d'environnement"
tags: [moneroo, mcp, sdk, ia, claude, typescript, npm]
github: https://github.com/aboudou-cto-bloko/moneroo-tools
npm_sdk: https://www.npmjs.com/package/moneroo
npm_mcp: https://www.npmjs.com/package/moneroo-mcp
created: 2026-04-29
updated: 2026-04-29
---

# Du SDK au serveur MCP — deux couches d'abstraction pour Moneroo

Même API. Deux interfaces complètement différentes. Deux types d'utilisateurs.

[`moneroo-tools`](https://github.com/aboudou-cto-bloko/moneroo-tools) contient deux packages :

```
packages/sdk/   → moneroo v0.1.1
packages/mcp/   → moneroo-mcp v0.4.2
```

Comprendre pourquoi les deux existent, c'est comprendre deux niveaux d'abstraction différents.

---

## La couche 1 — le SDK

> Si tu n'as pas encore lu la présentation du SDK : [Il n'existait pas de SDK TypeScript pour Moneroo →](./article-moneroo-sdk.md)

[`moneroo`](https://www.npmjs.com/package/moneroo) est un SDK TypeScript. Tu l'installes dans ton projet, tu l'appelles dans ton code.

```typescript
import { Moneroo } from 'moneroo';
const moneroo = new Moneroo({ secretKey: process.env.MONEROO_SECRET_KEY! });

const { data } = await moneroo.payments.initialize({ amount: 5000, currency: 'XOF', ... });
```

Tu écris du code. Tu contrôles tout. C'est l'outil du développeur.

**Public :** développeurs qui intègrent Moneroo dans une app Node.js.

---

## La couche 2 — le serveur MCP

[`moneroo-mcp`](https://www.npmjs.com/package/moneroo-mcp) est un **serveur MCP** — Model Context Protocol.

MCP est un standard ouvert qui permet à des assistants IA (Claude, Cursor, Windsurf...) d'utiliser des outils externes. Au lieu d'écrire du code pour interroger Moneroo, tu parles :

> "Montre-moi les 10 derniers paiements échoués."

> "Quel est le taux de conversion de la semaine dernière par rapport à la semaine précédente ?"

> "Génère un rapport PDF des transactions de mars."

Claude appelle les outils en arrière-plan. Toi, tu lis les résultats.

**Public :** développeurs et non-développeurs qui veulent piloter Moneroo depuis un assistant IA.

---

## 28 outils, 6 catégories

| Catégorie | Outils |
|-----------|--------|
| **Paiements** (4) | `list_payments`, `get_payment`, `verify_payment`, `create_payment_link` |
| **Payouts** (4) | `list_payouts`, `get_payout`, `create_payout`, `verify_payout` |
| **Analytics** (6) | rapport revenus, méthodes de paiement, heures de pointe, taux de conversion, comparaison périodes, tendances |
| **Insights** (5) | analyse des échecs, détection d'anomalies, risque de churn, prédiction revenus, suggestions d'optimisation |
| **Automations** (5) | rappels paiement, paiements récurrents, virements planifiés, alertes webhook, setup alertes |
| **Exports & Reports** (4) | CSV, comptabilité, facture, rapport PDF |

3 ressources MCP en plus : documentation API, méthodes de paiement par pays, codes de statut.

---

## Le lien entre les deux

Le MCP est construit **sur le SDK**. Les 28 outils appellent le SDK en dessous — ils ne réimplémentent pas les appels API.

```
Claude → appelle l'outil MCP → SDK → API Moneroo
```

Toute la logique de vérification, gestion des erreurs, typage — dans le SDK une seule fois. Le MCP expose une interface différente par-dessus.

C'est ça, un monorepo pnpm bien utilisé : partager la logique sans la dupliquer.

---

## Setup — Claude Desktop

```json
{
  "mcpServers": {
    "moneroo": {
      "command": "npx",
      "args": ["-y", "moneroo-mcp"],
      "env": {
        "MONEROO_SECRET_KEY": "sk_..."
      }
    }
  }
}
```

Redémarre Claude Desktop. Les outils apparaissent dans le panneau.

Fonctionne aussi avec Cursor, Windsurf, et tout client MCP compatible via stdio :

```bash
MONEROO_SECRET_KEY=sk_... npx moneroo-mcp
```

---

SDK ou MCP — selon qui tu es et ce que tu fais.

Le SDK : tu construis. Le MCP : tu interroges.

---

*→ Voir comment utiliser le SDK dans un flux de paiement complet : [Intégrer Moneroo dans Next.js + Convex](./tutoriel-moneroo-nextjs-convex.md)*
*→ PR moneroo-tools #1 : [feat(mcp): add moneroo CLI](https://github.com/aboudou-cto-bloko/moneroo-tools/pull/1)*
