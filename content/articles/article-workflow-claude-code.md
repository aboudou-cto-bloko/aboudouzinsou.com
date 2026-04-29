---
title: "Comment je travaille avec Claude Code au quotidien"
format: article
status: draft
tags: [workflow, claude, ia, developpement, second-brain, productivite]
created: 2026-04-29
updated: 2026-04-29
---

# Comment je travaille avec Claude Code au quotidien

La plupart des développeurs utilisent Claude comme un moteur de recherche glorifié.

Ils posent une question. Ils collent la réponse. Ils reposent une question.

C'est utile. Ce n'est pas du tout la façon dont ça change vraiment ton rythme de travail.

---

## Le contexte d'abord

Chaque projet a un `CLAUDE.md` à la racine. Ce fichier dit à Claude ce qu'il doit savoir sur le projet — conventions, règles critiques, stack, décisions d'architecture.

Sur [Pixel-Mart](https://pixel-mart-bj.com), il y a la règle F-01 :

> Toute modification de solde DOIT créer une transaction dans la même mutation, avant le `patch` du store.

Cette règle n'est pas réexpliquée à chaque session. Elle est dans le fichier. Claude la lit au démarrage et travaille en cohérence avec elle.

**La qualité du CLAUDE.md détermine la qualité des sessions.** Pas l'inverse.

---

## Ce que je lui confie

**Les migrations complexes.** La PR #250 sur [Pixel-Mart](https://pixel-mart-bj.com) : audit automatique des soldes vendeurs — formule comptable avec des cas edge (payout pending vs failed, idempotence, boutiques démo à ignorer). Ce type de tâche traverse plusieurs fichiers de schéma, demande de comprendre les invariants du système, et produit une migration avec mode `dry_run`. Claude fait ça bien parce que le contexte est documenté.

**Les features multi-couches.** PR #249 : transparence du taux de commission affilié + modification de l'état admin des commandes. Deux sous-features liées. Deux fichiers frontend + un fichier mutations Convex. Une session, un PR.

**Le debugging en profondeur.** Quand une query Convex retourne des données incorrectes — lui donner le schéma, la mutation, la query, l'output attendu. Laisser chercher l'invariant violé.

---

## Le Brain comme mémoire persistante

Chaque session significative génère automatiquement une note dans `~/Brain/_systeme/sessions/`.

Format : `YYYYMMDD-HHMM-contexte.md` — ce qui a été fait, les décisions prises, les apprentissages.

Ce n'est pas un journal. C'est une source de vérité technique. Quand je reviens sur un projet après quelques jours, je commence par lire la dernière session.

La session devient l'input de la prochaine.

---

## Ce que ça ne remplace pas

**Le jugement sur l'architecture.** Quand je dois décider si un flow passe par une mutation ou une action, si une feature va dans le core ou dans un package séparé — c'est moi. Claude exécute, questionne, suggère. La direction, c'est toujours moi.

**La connaissance du contexte métier.** Il sait que Moneroo n'a pas de centimes en XOF parce que c'est documenté dans les fichiers de patterns. Il ne le "sait" pas naturellement. La connaissance est dans les fichiers, pas dans le modèle.

---

## Ce que ça change

Le rythme. Sur des projets avec un bon `CLAUDE.md` et une documentation à jour — je livre des features en une session là où ça prendrait une journée sans assistance.

La qualité des commits. Chaque PR a une description complète, les décisions documentées, le contexte. Pas parce que j'aime écrire de la documentation — mais parce que c'est la condition pour que la session suivante soit productive.

Un système qui se nourrit de sa propre documentation.

---

*→ La règle F-01 et comment elle a permis un audit automatique des soldes : [insight-f01-regle-balance](./insight-f01-regle-balance.md)*
*→ Le Second Brain complet (Obsidian + Claude) : à venir*
