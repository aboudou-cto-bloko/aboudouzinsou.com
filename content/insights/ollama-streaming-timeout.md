---
title: "Ollama streaming : supprimer le timeout 5 minutes avec fetch en mode stream"
date: 2026-05-02
topic: llm
tags: [ollama, streaming, timeout, nodejs, typescript]
related:
  - ollama-prompt-compact
  - ollama-keep-alive
status: published
---

# Ollama : pourquoi passer en streaming supprime le timeout 5 minutes

Le problème : Ollama coupe la connexion après 5 minutes sur les requêtes non-streamées.

Ce n'est pas un timeout côté client. C'est le serveur Ollama (Go/GIN) qui ferme la connexion.

Un timeout côté client plus long (8 minutes, 10 minutes) ne change rien — Ollama a déjà raccroché.

---

## La cause

Une requête `chat()` non-streamée maintient une connexion silencieuse pendant toute la durée de la génération. Sur CPU avec un modèle 7B et un prompt de taille moyenne, ça peut durer plusieurs minutes.

Le serveur Ollama considère cette connexion inerte et la coupe.

---

## Le fix

Passer en streaming. Les tokens arrivent au fil de la génération — la connexion reste active en permanence.

```typescript
// ❌ Non-streamé — risque de timeout après 5 min
const response = await ollama.chat({
  model,
  messages,
  options: { num_predict: 100 },
});
return response.message.content.trim();

// ✅ Streamé — connexion active pendant toute la génération
const stream = await ollama.chat({
  model,
  messages,
  stream: true,
  keep_alive: -1,
  options: { num_predict: 100, num_ctx: 1024 },
});

let result = "";
for await (const chunk of stream) {
  result += chunk.message.content;
}
return result.trim();
```

Le résultat est identique. La différence est dans le transport : les tokens arrivent progressivement au lieu d'attendre la fin.

---

## Ce que `keep_alive: -1` apporte en plus

Sans `keep_alive`, Ollama décharge le modèle de la RAM après 5 minutes d'inactivité. La prochaine requête recharge le modèle depuis le disque : 10-15 secondes de délai.

`keep_alive: -1` garde le modèle chargé indéfiniment. Sur des agents qui font des requêtes régulières, c'est 10-15 secondes économisées à chaque appel.
