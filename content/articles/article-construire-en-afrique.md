---
title: "Construire en Afrique, pas pour l'Afrique"
format: article
status: published
tags: [afrique, marché, ia, whatsapp, llm, architecture, uemoa, benin]
date: 2026-05-02
created: 2026-05-02
updated: 2026-05-02
---

# Construire en Afrique, pas pour l'Afrique

Il y a une distinction que la plupart des entrepreneurs tech ratent.

Construire *pour* l'Afrique, c'est prendre un produit conçu ailleurs et l'adapter.

Construire *en* Afrique, c'est partir des contraintes locales comme fondation de design.

Le résultat est architecturalement différent.

---

## Les contraintes ne sont pas des problèmes à résoudre

Quand j'ai commencé à construire un agent commercial pour le marché béninois, j'aurais pu ignorer les spécificités.

Utiliser l'API WhatsApp officielle (chère, restrictive). Utiliser des modèles cloud (latence imprévisible, coût en devises). Viser des PME qui utilisent email et CRM comme en Europe.

Au lieu de ça, j'ai laissé les contraintes décider de l'architecture.

Les PME répondent sur WhatsApp, pas par email. Les APIs cloud facturées en dollars créent une structure de coût qui ne tient pas à ce stade. La connectivité n'est pas garantie — les agents doivent fonctionner localement.

Chaque contrainte était une décision d'architecture forcée. Et chaque décision forcée m'a évité de construire quelque chose d'inutile.

---

## Pourquoi WhatsApp n'est pas un "canal alternatif" ici

En Europe, l'email est le canal professionnel par défaut. WhatsApp est le canal personnel.

Ici, c'est inversé.

Un restaurant à Cotonou n'a pas forcément un email professionnel configuré. Il a WhatsApp. Il l'ouvre 40 fois par jour. Les décisions commerciales passent par là.

Concevoir un système de prospection avec email en priorité et WhatsApp en option, c'est construire pour un marché différent de celui que tu cibles.

Ce n'est pas une préférence utilisateur. C'est une donnée sociologique. La hiérarchie des canaux doit être inversée dans le code.

---

## Le bug que personne ne documente

Le Bénin a changé son format téléphonique : 8 chiffres → 10 chiffres avec préfixe `01`.

Google Maps retourne le nouveau format. Aucune librairie npm ne le gère. Aucun tutoriel ne l'anticipe.

```typescript
// phoneToJid() — les deux formats Bénin
if (cleaned.length === 10) return `229${cleaned}@s.whatsapp.net`;  // 01XXXXXXXX
if (cleaned.length === 8)  return `22901${cleaned}@s.whatsapp.net`; // ancien format
```

Ces 4 lignes n'existent dans aucun package. Elles n'existent que parce que j'ai construit ici, sur ce marché.

C'est le genre de connaissance qui ne s'acquiert pas à distance.

---

## Le calcul économique du LLM local

Utiliser GPT-4 pour chaque message WhatsApp généré : environ 0.02€ par message.

100 messages/jour × 30 jours = 60€/mois pour la génération seule.

Sur un marché où le ticket moyen est 150 000 XOF (~230€) pour un projet complet, cette structure de coût change les marges.

Avec Ollama en local (qwen2.5:7b, CPU) : coût marginal zéro après installation.

Ce n'est pas un compromis technique. C'est un choix de modèle économique. Le LLM local permet des patterns que tu n'oserais pas avec une API facturée : générer 50 messages en masse, analyser des patterns en arrière-plan, relancer tous les prospects dormants sans calcul de ROI préalable.

---

## Ce que ça produit comme architecture

Un agent qui fonctionne sans connexion internet pour les inférences.  
Un canal de contact prioritaire (WhatsApp) et un fallback (email).  
Une gestion des formats locaux — numéros de téléphone, devises en XOF sans centimes, heures d'envoi adaptées.  
Une mémoire persistante qui survit aux coupures de connexion.

Ce ne sont pas des workarounds. C'est l'architecture native de ce marché.

---

## La vraie leçon

Les marchés "émergents" ne sont pas des marchés en retard sur une courbe linéaire.

Ils ont leurs propres équilibres, leurs propres canaux, leurs propres contraintes économiques.

Les construire depuis ces contraintes produit des solutions qui ne seraient pas nées ailleurs — et qui sont difficiles à copier par quelqu'un qui ne vit pas ce contexte.

C'est l'avantage de construire en Afrique, pas pour l'Afrique.

---

*→ [L'agent, pas l'employé](./article-agent-pas-employe)*  
*→ [Devlog : 4 mois de construction de l'agent](../devlog/devlog-agent-commercial-autonome)*
