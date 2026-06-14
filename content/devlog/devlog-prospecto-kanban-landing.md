---
title: "Prospecto : kanban, variables custom et landing page en une journée"
date: 2026-06-01
tags: [prospecto, crm, whatsapp, kanban, dnd-kit, landing, next-js, docker, build-in-public]
status: published
description: "Ce que j'ai construit aujourd'hui sur Prospecto : vue kanban avec drag-and-drop, système de tags colorés, variables personnalisées dans les messages WhatsApp, et refonte complète de la landing page."
tldr: "En une journée sur Prospecto : kanban dnd-kit avec tags colorés et filtres cluster, variables personnalisées dans les messages WhatsApp ({{entreprise}}, {{ville}}...) lues depuis la base, et landing page réécrite dans la voix éditoriale du projet."
takeaways:
  - "Variables personnalisées lues depuis la base de données, jamais depuis la requête HTTP — zéro injection possible"
  - "NEXT_PUBLIC_ ne fonctionne pas dans une image Docker pré-buildée — VAPID auto-générées à l'init du container"
  - "Landing : headline avec tension + avant/après par persona convertit mieux que des cards avec emojis"
related:
  - devlog-agent-commercial-autonome
  - article-crm-pme-africaines
---

# Prospecto : kanban, variables custom et landing page en une journée

Prospecto est un mini CRM WhatsApp self-hosted.

La page prospects était un tableau. Un tableau plat, sans vie, sans information d'un coup d'œil.

J'ai changé ça aujourd'hui.

---

## Le kanban

La vue kanban remplace le tableau. Cinq colonnes : Nouveau → Contacté → Qualifié → Converti → Perdu.

Chaque carte = un prospect. Tu glisses de colonne en colonne. L'état est mis à jour en temps réel avec `@dnd-kit` — optimiste d'abord, serveur ensuite.

Ce qui rend ça utile : les clusters.

Chaque tag a une couleur que l'utilisateur choisit lui-même. Une barre de filtres au-dessus du kanban permet d'isoler un cluster en un clic. Tu vois uniquement les prospects avec ce tag, répartis dans leurs colonnes.

C'est comme ça qu'on lance une campagne ciblée : on filtre un cluster, on voit l'état de chaque prospect, on envoie.

---

## Les variables personnalisées

Les messages WhatsApp de Prospecto supportaient déjà `{{nom}}` et `{{telephone}}`.

Maintenant l'utilisateur peut créer ses propres variables — `{{entreprise}}`, `{{ville}}`, `{{produit}}`, n'importe quoi. Un slug (pour le template) et un libellé (pour le formulaire).

Quand on ajoute un prospect, les champs apparaissent. Les valeurs vont dans `metadata` en JSON. À l'envoi, les variables sont remplacées côté serveur.

La clé : les variables sont lues depuis la base de données, jamais depuis la requête HTTP. Aucun prospect ne peut injecter une valeur arbitraire.

---

## La landing page

Problème : la landing était générique. Des cards avec des emojis. Du copy sans tension. "Aucune compétence technique requise" — défensif et inutile.

J'ai tout réécrit dans ma voix.

Le hero : `Tu prospectes à la main. Arrête.` Headline alignée à gauche, `letter-spacing: -0.04em`, scramble kinetic text au chargement sur chaque ligne avec un décalage staggeré.

Les problèmes : plus de cards emoji. Une liste numérotée `01 / 02 / 03` avec les vrais chiffres — "2 heures pour 40 numéros", pas "La liste Excel dispersée".

Les personas : structure avant/après. Deux paragraphes par carte. Le premier raconte la galère. Le deuxième dit ce qui change.

Le CTA : un `LiquidButton` avec SVG filter (`feTurbulence` + `feDisplacementMap`) qui distord le fond derrière le bouton. Pas de bibliothèque — juste un SVG et du CSS.

---

## Ce qui est en production

- `v1.0.3` → kanban + tags + variables custom
- `v1.0.4` → script install autonome (télécharge docker-compose.yml lui-même)
- `v1.0.5` → VAPID auto-générées + installation guidée avec URL d'achat
- `v1.0.6` → fix VAPID dynamique (NEXT_PUBLIC_ ne fonctionne pas dans une image Docker pré-buildée)

La landing tourne sur `prospecto.aboudouzinsou.site`.

---

La prochaine étape : une page de témoignages dès les premiers utilisateurs, et un système de campagnes planifiées.
