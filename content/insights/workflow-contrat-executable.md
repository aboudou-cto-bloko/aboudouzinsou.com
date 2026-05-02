---
title: "Le workflow comme contrat exécutable — n'importe quel agent IA peut lire et exécuter"
date: 2026-05-02
topic: architecture
tags: [workflow, agent, ia, architecture, mcp, typescript, json]
related:
  - article-agent-pas-employe
status: published
---

# Le workflow comme contrat exécutable

La plupart des systèmes IA sont des boîtes noires. Tu sais ce qu'ils font. Tu ne sais pas comment.

Un workflow déclaratif résout ce problème. Le JSON *est* la documentation, et il s'exécute.

---

## La structure

Chaque tâche dans un workflow contient :

```json
{
  "id": "generate-wa",
  "name": "Générer les messages WhatsApp",
  "prompt": "Pour chaque lead dans savedLeads, génère un message de prospection personnalisé via generateMessage(lead, 'whatsapp'). Utilise le nom de l'établissement, sa note Google et son statut de présence digitale.",
  "tools": [
    { "name": "generateMessage", "source": "internal" }
  ],
  "input": {
    "leads": {
      "type": "array",
      "source": "${save-leads.output.savedLeads}",
      "required": true
    }
  },
  "output": {
    "messages": { "type": "array" }
  },
  "dependsOn": ["save-leads"]
}
```

Le `prompt` est en langage naturel. Les `tools` listent les fonctions à utiliser. Le `source` dans `input` référence la sortie d'une tâche précédente.

---

## Ce que ça autorise

N'importe quel agent IA — Claude Code, GPT via API, un modèle local — peut lire ce JSON et exécuter le workflow avec ses propres outils. Les `dependsOn` donnent l'ordre. Les `source` donnent la provenance des données.

```python
context = {}
for task in topological_sort(workflow.tasks):
    inputs = resolve_sources(task.input, context)
    result = execute(task, inputs)
    context[task.id] = {"output": result}
```

C'est un contrat entre le processus métier et n'importe quel runtime d'exécution.

---

## La règle

Tout processus répétitif avec des étapes définies peut être modélisé comme un workflow.

Le format garantit que si le code change, si l'outil change, si l'agent change — la définition de ce qui doit être fait reste lisible et exécutable.

La documentation qui ne s'exécute pas diverge du code. Le workflow qui *est* l'exécution reste toujours aligné.
