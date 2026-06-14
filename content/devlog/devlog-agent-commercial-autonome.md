---
title: "Agent IA commercial autonome : prospection WhatsApp, relances automatiques et apprentissage"
date: 2026-05-02
tags: [ia, agent, whatsapp, ollama, rag, discord, nodejs, typescript, build-in-public]
status: published
description: "4 mois de construction d'un agent commercial IA local : scraping Google Maps, messages WhatsApp personnalisés, relances automatiques, mémoire par prospect, apprentissage continu — zéro API cloud."
tldr: "4 mois pour construire un agent commercial entièrement local : scraping Google Maps, WhatsApp via Baileys, relances J+3/J+7/J+14, mémoire RAG par prospect, apprentissage continu des patterns — zéro API cloud pour les inférences IA."
takeaways:
  - "Ollama tronque silencieusement les prompts > 4096 tokens — surveiller les logs `truncating input prompt`"
  - "Les requêtes non-streamées sur CPU créent un timeout 5 min côté serveur Ollama, pas côté client"
  - "Le format téléphonique béninois (8→10 chiffres avec préfixe 01) n'existe dans aucune librairie npm"
  - "LLM local à coût marginal zéro autorise des patterns impossibles avec une API cloud facturée"
related:
  - devlog-brain-assistant
  - article-vitrinai
---

# J'ai construit un agent commercial qui prospecte, relance et apprend seul

Le problème de départ : la prospection commerciale prend du temps, les relances ne se font pas, et les mêmes erreurs se répètent d'une conversation à l'autre.

Ma question : est-ce qu'un système peut faire ça à ma place — et s'améliorer au fil du temps ?

---

## Ce que le système fait

**Il trouve des prospects.** Playwright scrape Google Maps sur une niche et une ville données. Chaque établissement est qualifié : numéro de téléphone présent, note Google, présence ou absence d'un site web. Les doublons sont éliminés par numéro de téléphone.

**Il contacte.** Un message WhatsApp est généré par Ollama (qwen2.5:7b, local) pour chaque prospect — personnalisé avec le nom de l'établissement, sa note, son score d'audit. Le message passe par une étape d'approbation humaine dans Discord avant envoi.

**Il relance.** Séquence J+3 / J+7 / J+14 automatique. Chaque relance apporte un angle différent : valeur ajoutée, preuve sociale, fermeture propre. Après trois relances sans réponse — silence.

**Il se souvient.** Pour chaque prospect, un fichier Markdown est maintenu automatiquement : faits extraits de la conversation, objections exprimées, prochaine étape convenue, budget mentionné. Ce fichier est indexé dans le RAG.

**Il apprend.** Après chaque conversation positive, l'agent extrait les objections et les réponses qui ont fonctionné. Ces patterns alimentent un graphe de connexions entre conversations similaires. Les scripts sont mis à jour automatiquement.

---

## L'architecture en 7 composants

```
1. Moteur de prospection   → Playwright + Google Maps + qualification
2. Contact multi-canal     → WhatsApp (Baileys) + Email (SMTP) + approbation Discord
3. Séquence de relances    → Scheduler 4h + J+3/J+7/J+14 + génération contextuelle
4. Mémoire par prospect    → fichier .md par numéro + RAG nomic-embed-text 768 dim
5. Base de connaissance    → fichiers .md par niche + vérification web DuckDuckGo
6. Système d'apprentissage → .patterns.jsonl + graphe de conversations + auto-update
7. Workflows déclaratifs   → JSON auto-décrits, exécutables par n'importe quel agent IA
```

Tout tourne en local. Zéro API cloud pour les inférences IA. Le seul service externe est Convex (base de données) et Discord (interface).

---

## Les 3 bugs qui ont appris le plus

**Le prompt de 4180 tokens.** Ollama a une fenêtre de contexte de 4096 tokens. Mon prompt injectait 11 621 caractères de base de connaissance à chaque message. Ollama tronquait silencieusement, puis tournait pendant 5 minutes avant de planter. La réponse était dans les logs depuis le début : `truncating input prompt limit=4096 prompt=4180`. Solution : une version compacte du contexte — 300 tokens pour WhatsApp, 700 pour email.

**Le timeout 5 minutes.** Même après avoir réduit le prompt, l'erreur persistait. Cause : les requêtes non-streamées font attendre Ollama en silence pendant toute la génération. Après 5 minutes, le serveur coupe la connexion côté Ollama (pas côté client). Solution : passer toutes les inférences en streaming. Les tokens arrivent progressivement, la connexion reste vivante.

**Les numéros béninois.** Le Bénin a changé son format téléphonique : 8 chiffres → 10 chiffres avec préfixe `01`. Google Maps retourne le nouveau format. L'agent tentait d'envoyer des messages WhatsApp vers des JIDs invalides, silencieusement. Fix : `phoneToJid()` gère les deux formats et force la conversion vers le nouveau.

---

## Ce que le LLM local change économiquement

Ollama sur CPU, pas d'API cloud.

100 messages générés par jour × 30 jours avec GPT-4 Turbo : environ 60€/mois pour la génération seule. Sur un marché où les clients paient 150 000 XOF (~230€) pour un projet complet, cette structure de coût devient une variable importante.

Avec un LLM local : coût marginal zéro après installation. La latence est plus haute (10-30 secondes par message au lieu de 2 secondes). Mais pour des messages qui ne sont pas urgents et passent par une validation humaine — c'est acceptable.

Le coût marginal zéro autorise des patterns que tu n'oserais pas avec une API facturée : générer 50 messages en masse, faire tourner l'analyse de patterns en arrière-plan, relancer tous les dormants sans calcul de ROI préalable.

---

## L'interface de contrôle

Tout se pilote depuis Discord — 12 commandes slash :

- `/prospecter niche:restaurants ville:Cotonou nombre:50` — lance le scraping
- `/campagne canal:whatsapp` — génère les messages pour tous les leads non contactés
- `/dashboard` — pipeline + intelligence IA + relances en 3 embeds
- `/prospect 22967xxxxxx` — fiche complète d'un prospect avec historique et patterns
- `/analyse jours:7` — feedback IA sur ce qui a fonctionné / pas fonctionné
- `/learning stats|graph|update` — état du système d'apprentissage

---

## Ce que ça n'est pas encore

L'agent répond aux prospects en 10-30 secondes (latence Ollama CPU). Sur certaines conversations rapides, c'est visible.

Le scraping Google Maps est limité par les CAPTCHAs — pas de scraping en masse sans pauses.

Le système d'apprentissage améliore les scripts, mais pas encore les intervalles de relance ni les critères de qualification.

Ces limites sont connues. Elles ne compromettent pas l'utilité du système. Elles définissent la prochaine phase.

---

*→ [L'agent, pas l'employé — philosophie de l'architecture](../articles/article-agent-pas-employe)*  
*→ [J'ai construit un assistant IA qui connaît tout ce que je sais](./devlog-brain-assistant)*
