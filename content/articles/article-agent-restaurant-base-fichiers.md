---
title: "Agent sur base de fichiers : la mémoire institutionnelle d'une PME comme système ingérable"
format: case-study
status: published
sector: pme
tags: [agent-ia, rag, restaurant, pharmacie, clinique, btp, école, hôtel, processus, pme, bénin, whatsapp, fichiers, second-cerveau]
description: "Restaurants, pharmacies, cliniques, chantiers, écoles — chacun accumule une connaissance opérationnelle qui vit dans les têtes des fondateurs. Cette étude de cas décrit l'architecture d'un agent qui lit une base de fichiers structurée et répond comme si le patron était là, quel que soit le secteur."
tldr: "Structurer la connaissance d'une PME en fichiers Markdown organisés par répertoire, puis brancher un agent LLM dessus. Le modèle s'applique à tout secteur où des questions répétitives mobilisent du temps humain : restaurant, pharmacie, clinique, BTP, école, hôtel. Installation : 75 000 – 120 000 FCFA. L'architecture ne change pas. Seul le contenu des fichiers change."
takeaways:
  - "Le chemin du fichier encode le contexte sans prompt supplémentaire : menu/plats/ vs ops/sop/ n'a pas besoin d'être expliqué à l'agent"
  - "Un patron peut mettre à jour sa base de connaissance en éditant un fichier texte — zéro compétence technique requise"
  - "L'agent ne sait que ce qui est écrit : c'est une contrainte qu'on vend comme fiabilité"
  - "Le modèle est identique dans tous les secteurs — seul le contenu des fichiers change"
  - "Commencer par 3 répertoires seulement et facturer chaque extension"
date: 2026-06-14
created: 2026-06-14
updated: 2026-06-14
related:
  - article-crm-pme-africaines
  - article-gestion-stock-caisse-pme-benin
  - article-prospection-whatsapp-afrique
---

# La connaissance d'une PME vit dans la tête du patron

Et quand le patron n'est pas là, la structure ne sait plus rien.

Dans un restaurant, le caissier répond mal aux questions sur les allergènes. Dans une pharmacie, le téléphone sonne toute la journée pour des questions de stock. Dans une école, la secrétaire répond au même parent trois fois en une semaine. Sur un chantier, tout s'arrête parce que personne n'a le dosage béton sans appeler le chef.

Ce n'est pas un problème de personnel.

C'est un problème d'architecture de l'information.

---

## Le vrai problème : la connaissance opérationnelle n'est stockée nulle part

Chaque restaurant accumule une base de connaissance :

- Les recettes exactes, avec les proportions et le coût matière
- Les règles de service : qui fait quoi, dans quel ordre
- Les contacts fournisseurs et leurs conditions
- Les heures d'ouverture selon les jours
- Les plats avec allergènes, pour répondre aux clients
- Les seuils d'alerte stock avant rupture

Cette connaissance existe.

Elle n'est juste pas écrite. Ou elle est écrite dans un cahier que personne ne retrouve. Ou dans un WhatsApp de groupe noyé sous 800 messages.

L'agent ne résout pas le problème de l'information manquante. Il résout le problème de l'information non accessible.

---

## L'architecture : un répertoire, pas une base de données

Le principe est simple.

On structure la connaissance du restaurant en fichiers Markdown organisés dans des dossiers. Le dossier encode le contexte. L'agent lit ces fichiers, les indexe, et répond aux questions.

```
restaurant/
├── menu/
│   ├── plats/
│   │   ├── poulet-yassa.md       # recette + allergènes + coût matière
│   │   └── riz-sauce-arachide.md
│   └── prix-actuels.json
├── ops/
│   ├── fournisseurs/
│   │   └── boulangerie-centrale.md
│   └── sop/
│       ├── ouverture.md
│       ├── fermeture.md
│       └── nettoyage-cuisine.md
├── finance/
│   ├── couts-recettes/
│   └── seuils-alerte.json
└── journal/
    └── 2026-06-14.md
```

Pas de schéma de base de données à concevoir. Pas d'interface admin à apprendre.

Le patron écrit dans un fichier texte. L'agent le lit.

---

## Ce que le chemin du fichier fait à la place du prompt

Quand l'agent reçoit un chunk de texte, il reçoit aussi son chemin.

`menu/plats/poulet-yassa.md` dit trois choses sans qu'on ait besoin de l'expliquer :
- C'est un plat (pas un fournisseur, pas une SOP)
- C'est dans le menu (pas dans les archives)
- C'est du texte à lire, pas du chiffre à agréger

Le répertoire structure l'intention.

Une base de données fait la même chose — mais elle demande de comprendre les migrations, les jointures, les rôles. Un fichier dans un dossier, n'importe qui peut le créer.

---

## Les trois modules qu'on installe en premier

### Module 1 — Agent WhatsApp menu

Le client envoie un message.

"C'est quoi vos plats du jour ?" L'agent lit `menu/prix-actuels.json` et répond avec le menu structuré. "Le poulet yassa contient des arachides ?" L'agent lit `menu/plats/poulet-yassa.md` et répond sur les allergènes.

Le personnel n'intervient pas. La gérante ne répond plus à ces questions.

### Module 2 — Checklist guidée pour le personnel

Chaque matin, le chef de salle ouvre WhatsApp. L'agent lit `ops/sop/ouverture.md` et envoie les étapes une par une. Il attend la confirmation avant de passer à la suivante.

Personne ne peut "sauter" une étape sans l'avoir confirmée.

Le patron voit le résultat dans `journal/` à la fin de la journée.

### Module 3 — Alerte food cost

L'agent lit `finance/couts-recettes/` et `finance/seuils-alerte.json`. Il compare le coût théorique à ce qui a été enregistré dans le journal du jour.

Écart supérieur à 15% → notification WhatsApp au patron.

Pas d'explication. Pas de tableau de bord à ouvrir. Une alerte, un lien, une décision.

---

## Le même modèle, cinq autres secteurs

Le restaurant est l'exemple le plus lisible. Mais le problème est identique dans cinq autres secteurs — et le temps perdu y est encore plus mesurable.

---

### Cliniques et cabinets médicaux

Le téléphone sonne toute la journée pour trois questions.

Le médecin est disponible aujourd'hui ? C'est combien la consultation ? Quels documents apporter ?

L'assistante répond. Elle raccroche. Elle répond encore. Elle passe 40% de sa journée sur ces trois questions.

```
cabinet/
├── medecins/
│   └── planning-semaine.json     # disponibilités par jour
├── tarifs/
│   └── consultations.md          # prix par type d'acte
└── procedures/
    └── documents-requis.md       # ce qu'il faut apporter selon la consultation
```

L'argument commercial ici est différent du restaurant. Ce n'est pas la commodité — c'est la fiabilité. Une assistante fatiguée peut se tromper sur un document requis. L'agent lit le fichier. Il ne se trompe pas.

"L'agent cite, il n'invente pas" — c'est exactement ce que veut entendre un médecin.

---

### Pharmacies

Le cas le plus pur du modèle.

Le client appelle : "vous avez le Doliprane 1000 ?" Le pharmacien pose son client, va vérifier, revient. Trois fois par heure.

```
pharmacie/
├── stock/
│   └── medicaments.json          # mis à jour chaque soir après inventaire
├── posologie/
│   └── notices-standard.md       # posologies usuelles pour les questions fréquentes
└── tarifs/
    └── prix-courants.json
```

Le stock est mis à jour manuellement chaque soir. L'agent répond aux questions de disponibilité toute la journée. Le pharmacien reste disponible pour les questions qui nécessitent son expertise.

La distinction est importante à poser avec le client : l'agent répond sur le stock et les prix. Il ne prescrit pas. Cette limite est écrite dans un fichier `regles/limite-agent.md` — et l'agent la cite si on lui demande de franchir la ligne.

---

### BTP et chantiers

Plusieurs chantiers en parallèle. Des ouvriers qui appellent le chef pour des décisions déjà écrites quelque part.

"On coule la dalle demain, le dosage béton c'est quoi ?" Le chef de chantier appelle le patron. Le patron est sur un autre site. Tout s'arrête.

```
chantier/
├── sop/
│   ├── coffrage-dalle.md
│   ├── carrelage-mural.md
│   └── enduit-facade.md
├── materiaux/
│   ├── fournisseurs.md           # contacts + délais + conditions
│   └── dosages-reference.json    # béton, mortier, enduit par type de travaux
└── equipes/
    └── attribution-chantiers.md  # qui est sur quel site cette semaine
```

L'agent répond au chef de chantier sur WhatsApp. Le patron n'est plus le goulot d'étranglement de huit chantiers simultanés.

Ce secteur a une particularité : les SOPs sont souvent dans la tête des artisans seniors. La valeur réelle de l'installation n'est pas l'agent — c'est la session de deux heures pendant laquelle on extrait et on écrit ce savoir avant qu'il parte à la retraite.

---

### Écoles et centres de formation

Les parents appellent. Tout le temps.

Programme, tarifs, emplois du temps, résultats, documents requis pour l'inscription. La secrétaire passe 60% de son temps à répondre à des questions qui sont dans le prospectus.

```
ecole/
├── inscription/
│   ├── documents-requis.md       # selon le niveau et la situation
│   ├── tarifs-scolarite.json
│   └── calendrier-paiements.md
├── programme/
│   └── emplois-du-temps/         # un fichier par classe
└── reglement/
    └── interieur.md
```

La période de rentrée concentre 80% du volume. L'agent absorbe le pic sans recruter une secrétaire supplémentaire pour deux mois.

Le directeur met à jour l'emploi du temps d'une classe en modifiant un fichier. L'agent répond sur la nouvelle version dès la prochaine re-indexation.

---

### Hôtels et maisons d'hôtes

Les questions des clients avant réservation sont prévisibles à 90%.

Disponibilité pour telle date, tarif pour telle chambre, ce qui est inclus dans le petit-déjeuner, comment venir depuis l'aéroport, quels restaurants à proximité.

```
hotel/
├── chambres/
│   ├── standard-simple.md        # description + tarif + équipements
│   ├── suite-familiale.md
│   └── disponibilites.json       # mis à jour chaque matin
├── services/
│   └── inclus-exclus.md
└── local/
    ├── acces-aeroport.md
    └── restaurants-proches.md
```

Le contenu local — restaurants, transports, activités — est stable sur plusieurs mois. Il est écrit une fois. L'agent répond 24h/24 pendant que le réceptionniste dort.

La maison d'hôtes qui répond à 2h du matin sur WhatsApp sans que personne ne soit éveillé convertit mieux que celle qui répond le lendemain matin.

---

## Ce que l'agent ne fait pas

L'agent ne sait que ce qui est écrit.

Si un plat n'est pas dans `menu/plats/`, l'agent dira qu'il ne le connaît pas. Si un fournisseur n'a pas de fichier, l'agent ne peut pas donner son numéro.

C'est une contrainte qu'on présente comme une garantie de fiabilité.

L'agent ne peut pas inventer. Il cite. Si le patron a écrit que la livraison coûte 500 FCFA dans un fichier, l'agent dira 500 FCFA. Pas approximativement. Pas "aux alentours de".

Cela oblige à écrire les règles. Et écrire les règles, c'est la partie qui manque dans presque tous les restaurants.

---

## La mise à jour : zéro compétence technique

Le patron veut changer le prix du poulet yassa.

Il ouvre le fichier `menu/prix-actuels.json`. Il change `4500` en `5000`. Il sauvegarde.

L'agent re-indexe automatiquement. En moins d'une minute, le nouveau prix est actif dans les réponses WhatsApp.

Pas de ticket à ouvrir. Pas de développeur à appeler. Pas d'interface admin à retrouver.

---

## Stack technique

```
Ingestion    : lecture récursive + chunking par fichier
Index        : LanceDB (local, pas de cloud requis)
LLM          : Ollama (local) ou Claude API (cloud)
Interface    : WhatsApp via WhatsApp Cloud API
Déclencheur  : cron toutes les 5 minutes ou webhook sur modification fichier
```

Le système peut tourner sur un VPS à 5$/mois ou sur un Raspberry Pi en local.

Aucune dépendance critique à un service cloud tiers.

---

## Ce que ça coûte, ce que ça vaut

**Installation et structuration initiale** : 75 000 – 120 000 FCFA  
*Inclut la mise en place du répertoire, la rédaction des premiers fichiers avec le patron, et l'installation de l'agent.*

**Module supplémentaire** : 25 000 – 45 000 FCFA par module  
*Chaque nouveau répertoire ingéré ou nouveau canal connecté est facturé séparément.*

**Maintenance mensuelle** : 15 000 – 25 000 FCFA  
*Mises à jour, surveillance, ajustements des réponses.*

La comparaison pertinente n'est pas "combien ça coûte" mais "combien coûte la gérante qui répond aux mêmes questions toute la journée".

---

## Comment choisir le premier secteur où déployer

Trois critères. Les secteurs qui cochent les trois sont à prioriser.

**Volume de questions répétitives élevé.** Le temps perdu doit être visible et mesurable. Une secrétaire qui passe 60% de sa journée sur des questions de programme scolaire — c'est mesurable. Un pharmacien qui décroche pour "vous avez du paracétamol" vingt fois par jour — c'est mesurable.

**Connaissance déjà partiellement écrite.** Tarifs, programmes, catalogues, SOPs — quelque chose existe quelque part, même dans un cahier ou un ancien WhatsApp. L'installation consiste à le structurer, pas à l'inventer.

**WhatsApp comme canal primaire.** L'agent s'installe là où le client est déjà. Pas dans une app à télécharger. Pas sur un site à trouver. Sur le numéro WhatsApp qui existe déjà.

Les cliniques et les pharmacies cochent les trois. C'est là que le ROI est le plus rapide à démontrer et le plus facile à chiffrer.

---

## Ce qu'on apprend en construisant ça

Le vrai travail n'est pas technique.

C'est d'asseoir le patron pendant deux heures et de lui demander de décrire comment sa structure fonctionne. Règle par règle. Tarif par tarif. Procédure par procédure.

L'agent ne crée pas la connaissance. Il la rend accessible.

Le livrable le plus important de ce projet, c'est le répertoire de fichiers — pas le code.

*→ [Gestion stock et caisse pour PME béninoises](./article-gestion-stock-caisse-pme-benin.md)*  
*→ [Prospection WhatsApp en Afrique](./article-prospection-whatsapp-afrique.md)*  
*→ [CRM pour PME africaines](./article-crm-pme-africaines.md)*
