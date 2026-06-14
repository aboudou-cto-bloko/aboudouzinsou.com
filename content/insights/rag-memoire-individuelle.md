---
title: "RAG individuel : prioriser la mémoire prospect dans un agent commercial IA"
date: 2026-05-02
topic: rag
tags: [rag, llm, mémoire, agent, typescript, embeddings]
tldr: "Un agent commercial RAG doit prioriser la mémoire individuelle du prospect sur la base globale. Si le prospect a mentionné un budget il y a 3 jours, le modèle doit le savoir avant de parler de prix — sinon il répond depuis le générique."
takeaways:
  - "Filtrer ChromaDB par `phone` du prospect en premier, compléter avec le global si < 3 résultats"
  - "Un fichier .md par prospect mis à jour après chaque échange est la base de la mémoire individuelle"
related:
  - ollama-prompt-compact
  - devlog-brain-assistant
status: published
---

# RAG individuel : prioriser la mémoire d'un prospect

La plupart des implémentations RAG récupèrent du contexte global : les chunks les plus proches dans toute la base.

Pour un agent commercial, c'est insuffisant.

---

## Le problème

Quand un prospect répond à un message, il y a deux types de contexte utiles :

1. **Sa mémoire individuelle** — ce qu'il a dit précédemment, ses objections, le budget mentionné, l'étape convenue.
2. **La base de connaissance** — l'offre, les prix, les scripts qui fonctionnent.

Le contexte individuel doit prendre le pas. Si le prospect a mentionné un budget de 100 000 XOF il y a 3 jours, le modèle doit le savoir avant de lui parler de prix.

---

## L'implémentation

Chaque prospect a un fichier Markdown dédié, mis à jour automatiquement après chaque conversation :

```
~/Brain/.../conversations/22967xxxxxx.md
```

Ce fichier contient les faits extraits par le LLM : budget, objections, intérêts, prochaine étape.

Au moment de la récupération RAG, le phone du prospect filtre les résultats :

```typescript
// Priorité aux chunks de CE prospect
const results = await topK(embedding, 5, { phone: prospect.phone });

// Si pas assez de contexte individuel → compléter avec la base globale
if (results.length < 3) {
  const global = await topK(embedding, 5 - results.length);
  return [...results, ...global];
}
```

---

## Ce que ça change

Un agent sans mémoire individuelle répond depuis la base de connaissance générale — correct mais générique.

Un agent avec mémoire individuelle ne répète pas ce qui a été dit, ne reprend pas une objection déjà résolue, ne propose pas un prix que le prospect a déjà négocié.

La cohérence dans une conversation longue vient de là.
