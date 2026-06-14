---
title: "Audit SEO et performance pour sites web de PME africaines avec VitrinAI"
format: article
status: published
description: "VitrinAI diagnostique la présence digitale des PME d'Afrique de l'Ouest — vitesse simulée sur réseau 4G AOF, SEO local, cohérence entre plateformes. Un score sur 100 en 30 secondes, sans inscription."
tldr: "VitrinAI mesure ce que Google ne mesure pas pour le marché africain : la performance réelle sur réseau 4G AOF (latence 100ms, 5 Mbps), la cohérence entre Google Maps, Facebook et WhatsApp. Un site rapide à Paris peut être inutilisable à Cotonou."
takeaways:
  - "La simulation réseau 4G AOF est la fonctionnalité centrale — mesurer la performance locale, pas depuis Paris"
  - "La cohérence nom/horaires entre Google Maps, Facebook et WhatsApp Business est souvent le critère le plus actionnable"
  - "4 axes analysés : santé technique, SEO, présence en ligne, expérience visiteur — 30+ critères, rapport en 30s"
tags: [vitrinai, saas, afrique, pme, seo, performance, diagnostic, nextjs, convex]
github: https://github.com/aboudou-cto-bloko/vitrinai
date: 2026-04-29
created: 2026-04-29
updated: 2026-04-29
---

# VitrinAI — diagnostiquer la présence digitale d'une PME ouest-africaine

Un site web qui charge vite à Paris peut être inutilisable à Cotonou.

Google mesure les performances depuis des serveurs en Europe. Ce que ça donne comme score n'a rien à voir avec ce que vit un client sur son mobile à Abidjan ou Dakar.

C'est le problème que [VitrinAI](https://github.com/aboudou-cto-bloko/vitrinai) résout.

---

## Ce que c'est

VitrinAI est un outil de diagnostic de présence digitale pour les PME d'Afrique de l'Ouest.

Tu entres une URL. Tu reçois un score sur 100 avec un rapport complet. En 30 secondes, sans inscription.

**4 axes, plus de 30 critères :**

| Axe | Ce qui est analysé |
|-----|-------------------|
| **Santé technique** | SSL, Core Web Vitals, compatibilité mobile |
| **Référencement Google** | SEO on-page, sitemap, données structurées |
| **Présence en ligne** | Facebook, Google Maps, WhatsApp, Instagram, TikTok |
| **Expérience visiteur** | Contact accessible, stabilité visuelle, accessibilité |

Le rapport donne les 5 actions prioritaires classées par impact.

---

## La simulation 4G AOF — pourquoi ça change tout

C'est la fonctionnalité centrale.

VitrinAI ne mesure pas la performance depuis Paris. Elle simule le chargement avec les paramètres réseau réels des opérateurs mobiles en Afrique de l'Ouest :

- **Latence : 100 ms**
- **Débit : 5 Mbps**

Ce sont les conditions d'un client type en zone UEMOA sur son mobile. Un site "rapide" selon Lighthouse peut dépasser 8 secondes de chargement dans ces conditions.

**L'outil utilisé :** Google PageSpeed Insights API v5 — avec les paramètres réseau personnalisés pour simuler ces conditions.

---

## Ce que l'axe "présence en ligne" voit que Lighthouse ne voit pas

Lighthouse analyse les performances d'un site. VitrinAI analyse aussi sa cohérence entre les plateformes.

Est-ce que le nom de l'entreprise est identique sur Google Maps, Facebook, et WhatsApp Business ? Est-ce que les horaires sont à jour ? Est-ce que le numéro de téléphone est cliquable depuis mobile ?

Pour une PME africaine dont l'essentiel des leads vient de Facebook et de bouche-à-oreille — ce sont souvent les critères les plus actionnables.

---

## Pour qui

Restaurants, cliniques, hôtels, salons, boutiques, cabinets. Toute entreprise en zone UEMOA avec un site web.

Pas un outil pour développeurs. Un outil pour le propriétaire de restaurant qui se demande pourquoi il n'apparaît pas dans les résultats Google.

---

## Stack

```
Next.js 16 · Convex · Tailwind v4 · Google PSI API v5 · jsPDF · Recharts
```

Le rapport PDF est généré côté client via jsPDF — pas de backend de génération, pas de stockage.

---

VitrinAI est en v0.1. Le diagnostic est gratuit et sans inscription.

---

*→ Pour les patterns Next.js + Convex utilisés dans cette stack : [Intégrer Moneroo dans Next.js + Convex](./tutoriel-moneroo-nextjs-convex.md)*
*→ Pour comprendre pourquoi la stack Convex dans un contexte africain : [Convex : query vs mutation vs action](./insight-convex-query-mutation-action.md)*
