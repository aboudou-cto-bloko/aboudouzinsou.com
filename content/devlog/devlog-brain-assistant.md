---
title: "Construire un assistant IA personnel avec RAG sur Obsidian et LLM local"
date: 2026-04-30
tags: [ai, llm, rag, chromadb, groq, ollama, open-webui, infrastructure, brain]
status: published
description: "Comment j'ai connecté mon Second Brain à un LLM local pour avoir un assistant qui comprend mes projets, mes conventions et mes patterns — sans payer par token."
tldr: "172 notes Obsidian découpées en 1 891 chunks, indexées dans ChromaDB, interrogeables via un proxy FastAPI qui injecte le contexte pertinent avant chaque appel Groq ou Ollama. L'assistant répond avec ta réalité, pas une généralité inventée."
takeaways:
  - "Fine-tuner sur 172 notes ne mémorise pas les faits — le RAG (lecture dynamique au moment de la requête) est la bonne approche"
  - "Le fallback Groq→Ollama est non-optionnel : le free tier a des limites de débit, le 429 arrive"
  - "Un modèle local moins capable + contexte Brain > grand modèle généraliste sans contexte pour les questions projet-spécifiques"
  - "Changer de modèle d'embedding nécessite une réindexation complète — les vecteurs ne sont pas comparables entre modèles"
related:
  - devlog-conception-ux-site
  - devlog-pipeline-site-perso
---

# J'ai construit un assistant IA qui connaît déjà tout ce que je sais

Le problème avec Claude, ChatGPT, et tous les autres : ils ne savent pas qui tu es.

À chaque session, tu recommences. Tu réexpliques ton stack. Tu rappelles tes conventions. Tu colles ton contexte. Et à la session suivante — rien. Mémoire effacée.

J'ai 172 notes dans mon Brain vault. 46 sessions de travail avec un agent IA. Des années de décisions documentées, de patterns validés, de snippets qui fonctionnent.

Tout ça dormait dans des fichiers Markdown. L'IA n'y avait pas accès.

---

## Le faux problème

La réaction instinctive : fine-tuner un modèle sur ces données.

C'est la mauvaise solution. Pour deux raisons.

Un modèle fine-tuné sur 172 notes apprend des patterns superficiels — il ne "mémorise" pas les faits. Et sur un modèle de 2B paramètres (le seul réaliste sur un i5 sans GPU), fine-tuner aggrave les choses. Les petits modèles ont un plafond de raisonnement que plus de données ne déplace pas.

Le vrai problème n'est pas le modèle. C'est l'accès au contexte.

---

## RAG : donner de la mémoire à un LLM qui n'en a pas

RAG — Retrieval-Augmented Generation. Avant chaque requête, on cherche les passages pertinents dans une base de connaissances, et on les injecte dans le prompt.

Le modèle ne mémorise rien. Il lit.

C'est la distinction qui change tout. Mémoriser = apprendre statiquement au moment de l'entraînement. Lire = accéder dynamiquement à de l'information à chaque requête.

Le Brain vault devient une base vectorielle. Chaque note est découpée en chunks de ~800 caractères, encodée avec `all-MiniLM-L6-v2` (80 MB, CPU), stockée dans ChromaDB. Quand je pose une question, le proxy calcule l'embedding de ma question, cherche les 8 chunks les plus proches (distance cosine ≤ 0.55), et les injecte dans le system prompt avant d'envoyer à Groq ou Ollama.

Le modèle voit mes notes. Sans les avoir "appris".

---

## L'architecture

```
Open WebUI (localhost:3004) — interface type Claude
    ↓
Proxy FastAPI (localhost:8080)
    ├── 1. RAG : query ChromaDB → contexte Brain injecté
    ├── 2. Groq API (llama-3.3-70b-versatile, gratuit)
    └── 3. Fallback Ollama → qwen3.5:2b si rate limit

ChromaDB (localhost:8001)
    └── 1 891 chunks depuis ~/Brain/
```

Trois services Docker. Un script d'indexation Python avec watcher inotify. Un service systemd qui démarre tout au login.

L'interface est Open WebUI — open source, identique à ChatGPT en apparence, tourne entièrement en local.

---

## Le fallback n'est pas optionnel

Groq a un free tier généreux. Mais il a des limites de débit. Quand on touche le 429, la requête doit aller quelque part.

Le proxy gère ça en deux lignes de logique : si Groq retourne 429, on bloque Groq pour 2 minutes, toutes les requêtes partent sur Ollama local. En mode stream, si le 429 arrive en cours de génération, on injecte un chunk de transition invisible et on continue sur Ollama. L'utilisateur ne voit rien.

Le modèle local est un qwen3.5:2b. Ce n'est pas llama-3.3-70b. Il est moins capable. Mais il répond en 10-14 tokens/seconde sur CPU et il connaît le contexte Brain — ce qui le rend plus utile pour les questions spécifiques à mes projets que n'importe quel grand modèle sans ce contexte.

---

## Ce que ça change concrètement

Je pose une question sur l'architecture de Pixelmart. Le proxy retrouve les notes du projet, le roadmap, les snippets d'intégration Moneroo. Le modèle répond avec le vrai contexte — pas une généralité inventée.

Je demande comment centrer une modal sans conflit Framer Motion. Il retrouve le snippet exact que j'ai documenté après avoir résolu ce bug.

Je parle d'une convention de code. Il sait déjà que je n'écris jamais de `any` TypeScript, que mes commits sont en français, que j'utilise Zod aux frontières système.

Ce n'est pas de la magie. C'est de la recherche vectorielle sur mes propres notes.

---

## Les limites honnêtes

Le modèle local ne remplace pas Claude. Pas même GPT-4o-mini. Sur des tâches de raisonnement complexe, il plafonne.

Le RAG n'est pas parfait. Si l'information que tu cherches n'est pas dans les 8 chunks récupérés, le modèle ne la voit pas. Le chunking par section Markdown rate parfois des informations importantes enfouies dans un long document.

Le hardware bride le confort. Un i5 sans GPU = 10-14 tok/s. Pour une conversation fluide c'est suffisant. Pour générer 500 lignes de code, c'est lent.

Ces limites sont connues. Elles n'invalident pas le système. Elles définissent son périmètre d'utilisation.

---

## La vraie valeur

L'IA généraliste te pose des questions.

L'IA qui a lu tes notes commence à répondre.

La différence n'est pas technique. Elle est dans le temps que tu ne perds plus à donner du contexte — et dans les réponses qui correspondent à ta réalité, pas à une réalité moyenne extrapolée de l'internet.

Le Brain vault était déjà utile comme archive personnelle. Il est maintenant une mémoire externe queryable en langage naturel.

*→ [Comment ce site a été conçu](./devlog-conception-ux-site)*
