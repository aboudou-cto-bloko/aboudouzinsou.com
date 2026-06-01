---
title: "Ollama keep_alive -1 : garder un modèle LLM en mémoire vive entre les requêtes"
date: 2026-05-02
topic: llm
tags: [ollama, performance, keep-alive, llm, nodejs]
related:
  - ollama-streaming-timeout
  - ollama-prompt-compact
status: published
---

# keep_alive: -1 — garder un modèle Ollama en RAM entre les appels

Par défaut, Ollama décharge un modèle de la RAM après 5 minutes d'inactivité.

La prochaine requête le recharge depuis le disque. Sur CPU, ça prend 10-15 secondes.

Pour un agent qui génère des messages à la demande, c'est un délai visible à chaque appel espacé de plus de 5 minutes.

---

## Le fix

Passer `keep_alive: -1` dans chaque appel.

```typescript
await ollama.chat({
  model: "qwen2.5:7b",
  messages,
  stream: true,
  keep_alive: -1,          // garde le modèle en RAM indéfiniment
  options: { num_predict: 100 },
});
```

Le modèle reste chargé entre les appels. Plus de rechargement 13 secondes.

---

## Quand ne pas l'utiliser

Si la machine a peu de RAM et que plusieurs modèles sont chargés en parallèle, `keep_alive: -1` peut consommer inutilement de la mémoire.

La valeur par défaut de 5 minutes est raisonnable pour un usage interactif (questions ponctuelles). Elle devient pénalisante pour un agent qui génère des messages à des intervalles irréguliers — parfois 2 minutes, parfois 20 minutes.

---

## Centraliser le client

Plutôt que de passer `keep_alive` à chaque appel dans chaque fichier, une seule instance Ollama partagée :

```typescript
// src/ollama/manager.ts
export const ollamaClient = new Ollama({
  host: config.ollama.host,
  fetch: fetchWithTimeout(10 * 60 * 1000),
});
```

Et `keep_alive: -1` dans chaque `chat()` call. Tous les modules importent `ollamaClient` au lieu d'instancier leur propre `new Ollama()`.
