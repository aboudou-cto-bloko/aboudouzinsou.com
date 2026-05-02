---
title: "Ollama : 300 tokens au lieu de 4180 — comment le prompt compact a résolu un timeout 5 minutes"
date: 2026-05-02
topic: llm
tags: [ollama, llm, performance, tokens, prompt]
related:
  - ollama-streaming-timeout
  - ollama-keep-alive
status: published
---

# Ollama : 300 tokens au lieu de 4180

Le symptôme : chaque génération de message prenait 5 minutes, puis plantait.

Le log qui expliquait tout était là depuis le début :

```
msg='truncating input prompt' limit=4096 prompt=4180
```

184 tokens de trop. Ollama tronquait silencieusement le prompt, recevait un texte incomplet, et tentait quand même de le compléter pendant 5 minutes.

---

## Pourquoi le prompt était trop grand

J'injectais toute la base de connaissance dans chaque message : frameworks Hormozi, contexte marché UEMOA, objections, scripts validés, fiche niche. 11 621 caractères. Pour générer un message WhatsApp de 3 phrases.

C'est comme relire l'intégralité d'un manuel de vente avant chaque phrase.

---

## La version compacte

Pour un message WhatsApp, la décision est simple : quelle offre proposer, dans quel style.

```typescript
// ~300 tokens pour WA — l'essentiel uniquement
sections.push(`## Offre
- Sans site → Pack Vitrine Express 150 000 XOF : site + Google Maps + WhatsApp Business. 72h.
- Avec site → Plan Pro 9 900 XOF/mois. Audit gratuit en premier.`);

sections.push(`## Règles WhatsApp
1. Douleur → Rêve → Fix en MAX 3 phrases
2. Chiffres réels, délais précis
3. 1 seul CTA simple`);
```

Le modèle n'a besoin que de ça. Le reste du contexte, aussi valable soit-il, n'est pas utile pour *cette* décision.

---

## La règle

Avant chaque appel LLM : quelle est la décision minimale que ce modèle doit prendre ?

Lui donner exactement ce qu'il lui faut. Rien de plus.

Un prompt plus grand ne rend pas le modèle meilleur s'il n'a pas besoin du surplus. Il le rend plus lent, et parfois cassé.
