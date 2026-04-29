---
title: "WIBN — trouver des idées SaaS en analysant la douleur sur Reddit"
format: article
status: draft
tags: [wibn, saas, idées, reddit, groq, inngest, ia, validation]
github: https://github.com/aboudou-cto-bloko/wibn
created: 2026-04-29
updated: 2026-04-29
---

# WIBN — trouver des idées SaaS en analysant la douleur sur Reddit

Les meilleures idées SaaS viennent des gens qui expriment leur frustration en public.

Reddit est plein de ça. Quelqu'un qui écrit "je passe 3 heures par semaine à faire ça manuellement, il n'existe pas un outil ?" — c'est un pain point documenté, en temps réel, avec des votes qui indiquent le niveau d'intérêt collectif.

[WIBN](https://github.com/aboudou-cto-bloko/wibn) — "What Is Broken Now" — automatise l'extraction et l'analyse de ces signaux.

---

## Ce que ça fait

Le pipeline en 4 étapes :

**1. Scraping** — collecte de posts Reddit (et HackerNews) filtrés par thème. Sources configurables, rate limiting via Upstash Redis.

**2. Scoring** — chaque post reçoit un `painScore` calculé à partir de plusieurs critères. Le `painScore` est différent du score Reddit :

```typescript
interface ScoredPainPoint extends RawPainPoint {
  painScore: number;   // niveau de douleur réelle calculé
  score: number;       // upvotes Reddit bruts
}
```

Le `score` Reddit mesure la popularité. Le `painScore` mesure l'acuité du problème. Ce ne sont pas la même chose.

**3. Analyse IA** — Groq analyse les pain points les plus scorés et génère des pistes de solutions SaaS.

**4. Background jobs** — Inngest orchestre le scraping en arrière-plan. Retry automatique si une source est lente ou indisponible.

---

## Pourquoi Groq et pas OpenAI

Pour de la classification et génération d'idées en masse, la latence compte plus que la précision absolue. Groq est significativement plus rapide sur des inférences courtes. C'est du volume.

---

## Pourquoi Inngest

Le scraping ne doit pas bloquer l'interface. Et une source lente ne doit pas tuer tout le pipeline.

```typescript
export const scrapePainPoints = inngest.createFunction(
  { id: "scrape-pain-points" },
  { event: "scraper/run" },
  async ({ event, step }) => {
    const raw = await step.run("fetch-posts", () => fetchRedditPosts(event.data.query));
    const scored = await step.run("score-posts", () => scorePainPoints(raw));
    await step.run("store", () => storePainPoints(scored));
  }
);
```

Chaque `step` est isolé. Si `score-posts` échoue, Inngest relaie depuis là — pas depuis le début.

---

## Stack

```
Next.js 15 · Drizzle ORM · Vercel Postgres · Groq SDK · Inngest · Better Auth · Upstash Redis
```

---

## L'état du projet

WIBN est fonctionnel côté scraping et scoring. C'est un outil personnel — pas un SaaS public à ce stade. L'hypothèse à tester : peut-on trouver des idées SaaS validées par le marché en moins de 10 minutes, plutôt que de passer des semaines à chercher un problème à résoudre.

---

*→ Pour un exemple de SaaS construit depuis la validation d'un problème réel : [La confiance est un produit — Pixel-Mart](./article-confiance-comme-produit.md)*
*→ Pour les patterns Inngest + Next.js : aucune documentation complète en français n'existe encore — c'est prévu.*
