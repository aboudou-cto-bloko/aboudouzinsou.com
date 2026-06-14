---
title: "Second cerveau numérique avec Obsidian : pourquoi et comment j'ai tout centralisé"
date: 2026-04-30
tags: [second-brain, brain, obsidian, portfolio, système, connaissance, ia]
status: published
description: "Pourquoi j'ai construit un second cerveau avant de construire ce site — système de fichiers, connexions neurales simulées, et l'objectif à long terme."
tldr: "Un vault Obsidian en 4 couches : données (Markdown brut immuable), système (templates + MOC), interface (CLI + éditeur), agents (Claude Code + scripts). La couche 1 est intouchable — les fichiers survivent à n'importe quel changement d'outil."
takeaways:
  - "1 note = 1 concept avec identifiant stable YYYYMMDD-HHmm-slug.md — l'adresse permanente d'une idée"
  - "Les [[wikilinks]] accumulent un graphe de connexions — les idées avec le plus de backlinks sont les plus importantes"
  - "Le site est une extraction du vault : les articles existent dans Brain avant d'exister en ligne"
  - "183 fichiers, ~2 000 chunks, requêtables en langage naturel via le Brain Assistant RAG"
related:
  - devlog-pipeline-site-perso
  - devlog-brain-assistant
  - article-workflow-claude-code
---

# Tout ce que je sais, au même endroit

Pendant longtemps, ce que je savais était éparpillé.

Dans des bookmarks. Dans des onglets ouverts. Dans des chats Discord oubliés. Dans des repos GitHub que je ne retrouvais plus. Dans ma tête.

Le problème n'est pas d'apprendre. C'est de retrouver.

---

## L'idée de départ

Je voulais un endroit — un seul — où tout ce que je sais existe sous une forme que je peux interroger, lier, faire évoluer.

Pas une app. Une app peut disparaître, changer de modèle économique, fermer.

Des fichiers. Texte brut. Markdown. UTF-8. Des choses qui existent encore dans vingt ans quand n'importe quel outil peut les lire.

---

## Le système de fichiers

Le vault vit dans `~/Brain/`. Sa structure :

```
Brain/
├── inbox/         Capture brute — tout arrive ici
├── notes/         Notes atomiques permanentes
├── projets/       Projets actifs avec objectif défini
├── ressources/    Connaissances réutilisables, intemporelles
├── archives/      Terminé, abandonné, obsolète
└── _systeme/      Templates, scripts, MOC, sessions IA
```

1 note = 1 concept. C'est la règle qui ne change pas.

Chaque fichier a un identifiant stable : `YYYYMMDD-HHmm-slug.md`. Le nom ne change jamais, même si le titre change. C'est l'adresse permanente d'une idée.

---

## Les connexions neurales

Les dossiers stockent. Les liens naviguent.

Écrire `[[nom-de-la-note]]` crée un lien entre deux concepts. Ces liens s'accumulent. Une note forte a plusieurs backlinks entrants — plusieurs idées qui pointent vers elle.

Ce réseau de pointeurs simule les connexions neurales du cerveau. Pas une métaphore. Une architecture réelle : les concepts forment un graphe, les chemins les plus empruntés révèlent les idées les plus importantes.

Quand je travaille sur Bloko et que j'écris un pattern de gestion de solde, le lien pointe vers `ressources/competences/convex/mutation-patterns.md`. Quand je réutilise le même pattern sur Pixel-Mart, même lien, même destination.

Deux projets. Une connaissance. Visible dans le graphe.

---

## Les 4 couches

Le Brain a une architecture en couches :

```
COUCHE 4 — AGENTS      Claude Code · scripts bash · Brain Assistant
COUCHE 3 — INTERFACE   Obsidian · hub CLI · terminal
COUCHE 2 — SYSTÈME     Templates · MOC · sessions IA · CLAUDE.md
COUCHE 1 — DONNÉES     .md avec frontmatter YAML · nommage stable
```

La couche 1 est intouchable. C'est elle qui garantit que le système survit à n'importe quel changement d'outil.

Les couches 2-4 évoluent. Peu importe quel éditeur ou quel agent IA demain — les fichiers sont là.

---

## Du Brain au site

Ce site est une extraction du vault.

Le pipeline :

```
~/Brain/projets/portfolio/drafts/  →  content/<section>/  →  git push  →  Vercel
```

Les articles que tu lis ici ont commencé comme des notes Markdown dans `~/Brain`. Le frontmatter YAML est le même. Les cross-links entre articles sont résolus automatiquement à la compilation par un plugin remark.

Je n'écris pas "pour le site". J'écris dans le Brain. Le site est une fenêtre sur ce qui est déjà là.

---

## L'objectif à long terme

Isoler, de façon précise, les compétences qui me sont propres et les rendre utiles à des besoins bien définis.

Pas un profil générique. Une carte de ce que je sais faire, dans quel contexte, avec quelles contraintes, pour quel marché.

Le Brain Assistant — un LLM local connecté au vault via RAG — peut déjà interroger ce savoir en temps réel. 183 fichiers. 2 000 chunks. Requêtable en langage naturel.

C'est la première version de cette carte devenue machine.

La prochaine étape : chaque connaissance documentée dans le vault, précisément taggée, rattachée à des preuves concrètes — projets, commits, décisions — et isolable par domaine.

Pas un CV. Un système de compétences vérifiables.

---

*→ [Le pipeline Brain → site en détail](./devlog-pipeline-site-perso.md)*
*→ [L'assistant IA connecté au vault](./devlog-brain-assistant.md)*
*→ [Comment je travaille avec Claude Code au quotidien](./article-workflow-claude-code.md)*
