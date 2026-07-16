---
title: "Paiement en ligne au Bénin : agrégateurs ou orchestrateur — comment choisir ?"
format: article
status: published
description: "FedaPay, KKiaPay et CinetPay sont des agrégateurs. Moneroo est un orchestrateur. Ce n'est pas le même niveau de la pile — et confondre les deux coûte du temps et des intégrations en double."
tldr: "FedaPay, KKiaPay et Moneroo ne sont pas des concurrents — ils sont deux couches différentes de la même pile. Les agrégateurs connectent les opérateurs, l'orchestrateur connecte les agrégateurs. Le choix dépend du nombre de pays et du besoin de payout."
takeaways:
  - "Projet mono-pays sans payout multi-devises : intègre directement FedaPay ou KKiaPay"
  - "Projet multi-pays ou payout dans plusieurs pays : Moneroo — une seule intégration pour tout"
  - "Le failover automatique de Moneroo absorbe les pannes d'agrégateur sans que le client le remarque"
  - "Le flux Mobile Money reste asynchrone quel que soit le niveau de la pile — c'est ta responsabilité de le gérer"
tags: [paiement, moneroo, fedapay, kkiapay, cinetpay, bénin, afrique, api, mobile-money, développeur, nextjs, architecture]
date: 2026-06-11
created: 2026-06-11
updated: 2026-06-11
related:
  - article-mobile-money-benin
  - tutoriel-moneroo-nextjs-convex
  - article-ecommerce-benin
---

# Paiement en ligne au Bénin : agrégateurs ou orchestrateur — comment choisir ?

Quand tu cherches une solution de paiement pour un projet béninois, tu tombes sur FedaPay, KKiaPay, CinetPay, Moneroo.

Tu as l'impression de choisir entre concurrents.

Ce ne sont pas des concurrents. Ce sont deux couches différentes de la même pile.

---

## La pile de paiement Mobile Money — telle qu'elle existe vraiment

```
Opérateurs        → MTN, Moov, Orange, Wave
                      ↓
Agrégateurs       → FedaPay, KKiaPay, CinetPay
                      ↓
Orchestrateurs    → Moneroo, HUB2
                      ↓
Marchands         → ton site, ton SaaS
```

Un **agrégateur** connecte plusieurs opérateurs (MTN, Moov, Orange, Wave) et expose une API unifiée. Tu intègres FedaPay une fois — tu accèdes à tous les opérateurs qu'il supporte.

Un **orchestrateur** se connecte à plusieurs agrégateurs et expose une API encore plus large. Tu intègres Moneroo une fois — tu accèdes à 12 passerelles de paiement, dans 30 pays, avec 20 méthodes de payout.

FedaPay est dans Pixel-Mart. Via Moneroo.

---

## Agrégateurs — quand les utiliser directement

### FedaPay

Bénin, Burkina Faso, Côte d'Ivoire, Guinée, Mali, Niger, Sénégal, Togo. Commissions 2–3%, négociables selon le volume. MTN Money, Moov Money, Orange Money, Wave, et cartes bancaires. Transparence tarifaire — un avantage réel sur un marché où les prix sont souvent flous.

**Bon choix si :** tu veux intégrer directement sans couche supplémentaire, tu opères sur 1–3 pays, tu n'as pas besoin de payout dans des pays hors couverture FedaPay.

### KKiaPay

Certifié PCI DSS 3.2, agréé BCEAO. Fort au Bénin. Réputation solide sur la conformité réglementaire.

**Bon choix si :** la conformité PCI DSS est un critère explicite (fintech, traitement de flux réglementés).

### CinetPay

64+ moyens de paiement, 25 000+ clients actifs, plugins WooCommerce / Magento / PrestaShop. Fort en Côte d'Ivoire, présent dans toute l'Afrique francophone.

**Bon choix si :** tu builds sur une plateforme existante (WooCommerce, PrestaShop) et tu as besoin d'un plugin prêt à l'emploi.

---

## Moneroo — quand utiliser l'orchestrateur

Moneroo ne concurrence pas FedaPay. Il s'appuie dessus.

12 passerelles. 30 pays. 20 méthodes de payout. Une seule intégration.

Ce que ça change concrètement : si ton produit doit accepter un paiement en Côte d'Ivoire via CinetPay, rembourser un vendeur au Sénégal via Wave, et enregistrer une vente au Bénin via MTN — sans Moneroo, c'est trois intégrations différentes, trois webhooks à gérer, trois bases de code à maintenir. Avec Moneroo, c'est une.

**Bon choix si :** ton produit couvre plusieurs pays avec des passerelles différentes, tu veux une seule API pour les paiements entrants et les payouts, tu builds en TypeScript (le SDK officiel `moneroo` sur npm, zéro dépendances, existe).

**Le failover.** C'est l'argument de résilience que les agrégateurs seuls ne peuvent pas offrir. Si FedaPay est indisponible au moment où ton client paye, Moneroo relaie automatiquement vers une autre passerelle compatible. En production, les agrégateurs ont des incidents — des minutes d'interruption qui font abandonner des paniers. Un orchestrateur absorbe ces incidents sans que ton client le remarque.

**Ce que Moneroo n'est pas :** un agrégateur low-cost pour un projet mono-pays. Si tu vends uniquement au Bénin et que tu n'as pas de besoin de payout multi-pays, intégrer directement FedaPay ou KKiaPay est plus simple.

---

## La règle

```
Projet mono-pays, besoins simples ?
→ Agrégateur direct. FedaPay ou KKiaPay au Bénin.

Projet multi-pays ou payouts dans plusieurs devises/opérateurs ?
→ Orchestrateur. Moneroo : une intégration, tout le reste.

Site WooCommerce / PrestaShop existant ?
→ CinetPay. Le plugin existe.
```

---

## Ce que personne ne mentionne

Peu importe le niveau de la pile que tu utilises, le flux Mobile Money reste asynchrone.

Le client initie sur ton site. Il confirme sur son téléphone via USSD. L'opérateur envoie un webhook. Ton backend vérifie, puis crédite.

Ce circuit — et les cas d'erreur qu'il génère — est ta responsabilité, pas celle de la passerelle. J'ai documenté le circuit complet avec le code dans un article séparé.

---

**Besoin d'aide pour intégrer un de ces agrégateurs ou Moneroo sur ton projet ?** J'ai construit cette intégration plusieurs fois (Pixel-Mart, RendezApp) — webhooks, cas d'erreur, tests avec de vrais numéros MTN inclus.

→ [Écris-moi sur WhatsApp](https://wa.me/2290167266360?text=Bonjour%2C%20j%27ai%20besoin%20d%27aide%20pour%20int%C3%A9grer%20un%20paiement%20Mobile%20Money%20sur%20mon%20projet.)

---

*→ [Comment intégrer le Mobile Money sur son site — le circuit complet](/articles/article-mobile-money-benin)*
*→ [Le tutoriel Next.js + Convex + Moneroo avec tout le code](/tutoriels/tutoriel-moneroo-nextjs-convex)*
*→ [Le SDK Moneroo — pourquoi il n'existait pas et comment je l'ai construit](/articles/article-moneroo-sdk)*
