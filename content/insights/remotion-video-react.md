---
title: "Remotion : créer des vidéos programmatiques avec React et TypeScript"
date: 2026-04-29
topic: outils
order: 1
tags: [remotion, react, video, typescript]
related:
  - convex-query-mutation-action
status: published
---

# Remotion — faire des vidéos avec React

Remotion, c'est une librairie qui te permet de composer une vidéo avec des composants React.

Chaque frame est un render. Tu as accès à `useCurrentFrame()` — un entier qui représente la frame en cours — et tu construis tes animations exactement comme tu construirais une UI dynamique.

```typescript
import { useCurrentFrame, interpolate } from 'remotion';

function FadeIn({ children }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });
  return <div style={{ opacity }}>{children}</div>;
}
```

`interpolate(frame, inputRange, outputRange)` — tu mappe des frames sur des valeurs CSS.

---

## Ce que j'en ai fait

La vidéo promotionnelle [Pixel-Mart](https://pixel-mart-bj.com) — 45 secondes, 30fps, format vertical 1080×1920 — construite avec 7 scènes React :

```
Scene1 — Intro (logo, tagline)
Scene2 — Créer sa boutique
Scene3 — Ajouter un produit
Scene4 — Commande reçue
Scene5 — Livraison
Scene6 — Dashboard vendeur
Scene7 — Outro (CTA)
```

Chaque scène est un composant. La composition principale orchestre les transitions et les durées.

---

## Les animations springées

Remotion a `spring()` — une animation physique avec stiffness et damping.

```typescript
import { spring, useVideoConfig, useCurrentFrame } from 'remotion';

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const scale = spring({
  frame,
  fps,
  config: { stiffness: 200, damping: 22 },
});
```

Pour des badges, des notifications, des éléments qui "arrivent" — le rebond naturel passe bien mieux qu'un tween linéaire.

---

## Ce que ça change par rapport à After Effects

Tout est du code. Une variable change dans le config — toutes les scènes qui l'utilisent sont mises à jour. Tu versions la vidéo avec git.

La limite : Remotion génère des MP4 via Puppeteer. Sur Linux, la dépendance à Chromium peut être un frein dans certains environnements.

Pour des vidéos SaaS avec des composants UI (dashboards, mockups, données dynamiques) — c'est plus rapide qu'un logiciel de motion design traditionnel.
