---
title: "Combien coûte un site web au Bénin en 2026 ?"
format: article
status: published
description: "La même demande peut déclencher un devis à 30 000 XOF ou à 2 000 000 XOF. Ce que ça révèle sur le marché — et comment lire un devis avant de signer."
tldr: "Un site web béninois n'a pas de prix standard parce qu'il n'y a pas de définition partagée du produit. Landing page : 150–300K XOF. E-commerce avec Mobile Money : 500K–1,5M XOF. La vraie question n'est pas le coût du site — c'est le coût de l'absence."
takeaways:
  - "L'intégration Mobile Money seule coûte 150–400K XOF sur un site existant — c'est du développement, pas de la configuration"
  - "Demande systématiquement : qui héberge, le code m'appartient-il, qu'est-ce qui est inclus après livraison"
  - "Un devis à 30K XOF pour un e-commerce complet est un template habillé — pas le même produit"
  - "Prépare ton contenu (textes, photos, logo) avant de signer — les retards viennent toujours de là"
tags: [bénin, cotonou, prix, site-web, freelance, e-commerce, mobile-money, seo, tarif]
date: 2026-05-20
created: 2026-05-20
updated: 2026-05-20
---

# Combien coûte un site web au Bénin en 2026 ?

La même demande — "je veux un site pour mon entreprise" — peut déclencher un devis à 30 000 XOF ou à 2 000 000 XOF.

Les deux prestataires ont répondu à la même question. Mais ils n'ont pas construit la même chose.

C'est le problème fondamental du marché web au Bénin. Il n'y a pas de prix standard parce qu'il n'y a pas de définition partagée du produit.

---

## Un site web n'est pas un objet

C'est là que commence la confusion.

Un site web peut être une page HTML uploadée sur un hébergeur à 2000 XOF/mois. Il peut être une application distribuée sur 14 serveurs dans 8 régions du monde. Les deux "ouvrent dans un navigateur". Les deux sont appelés "site web".

La question n'est pas combien coûte un site. La question est : **quel problème doit-il résoudre ?**

Un restaurant qui veut que ses clients trouvent son adresse sur Google a besoin d'autre chose qu'un e-commerce qui encaisse des paiements MTN à 3h du matin sans intervention humaine.

Traiter les deux comme le même produit — c'est là que les devis deviennent illisibles.

---

## Ce que le prix bas couvre réellement

Il existe au Bénin des offres à 30 000 – 80 000 XOF pour "un site complet".

Ce n'est pas du mensonge. C'est de la précision sélective.

Ce que tu obtiens : un template WordPress ou Wix configuré en 2 heures. Un hébergement mutualisé chez un provider qui coupe les sites en cas de surcharge. Pas de Mobile Money. Pas de SEO réel. Pas de code source livré — si tu veux changer de prestataire dans 6 mois, tu repars de zéro.

Le signe le plus révélateur : demande au prestataire qui héberge le site. Si la réponse est vague, le site vit sur son compte personnel. Quand il arrête de payer ou disparaît, ton site aussi.

J'ai vu des sites béninois afficher la page d'erreur Vercel par défaut — *"This deployment could not be found"* — parce que le prestataire avait supprimé son compte.

Le site était mort. Le client n'avait aucun accès pour le récupérer.

---

## Les vrais chiffres, projet par projet

Ces tarifs sont basés sur les projets que j'ai construits et sur les devis du marché local actuel (mai 2026).

**Landing page — 150 000 à 300 000 XOF**

Une page unique. Présentation d'une offre, formulaire de contact, CTA. Mobile-first, SEO de base, hébergement Vercel inclus.

Délai réel : 1 à 2 semaines.

Idéale pour tester un marché, accompagner une campagne pub, ou valider un concept avant d'investir davantage.

---

**Site vitrine — 300 000 à 600 000 XOF**

3 à 8 pages. Accueil, services, à propos, contact. Google Maps intégré, SEO local ciblant Cotonou ou ta ville, formulaire fonctionnel.

Délai réel : 2 à 4 semaines.

La fourchette basse (300 000) correspond à un site sans contenu complexe, livré rapidement parce que le client fournit ses textes et photos. La fourchette haute (600 000) : contenu à rédiger, maquettes sur mesure, animations.

---

**Site e-commerce — 500 000 à 1 500 000 XOF**

Catalogue produits, panier, paiement Mobile Money intégré (MTN, Moov), tableau de bord commandes, gestion des stocks, emails de confirmation automatiques.

Délai réel : 4 à 8 semaines.

C'est le projet le plus demandé et le plus sous-estimé. La partie visible — les pages — représente 30% du travail. Les 70% restants : l'intégration paiement, les webhooks de confirmation, la logique métier, les cas d'erreur.

---

**Application SaaS — 1 500 000 XOF et plus**

Authentification, abonnements, base de données temps réel, tableau de bord admin, API. Le type de projet derrière [Pixel-Mart](https://pixel-mart-bj.com), RendezApp ou PLR Library.

Délai réel : 8 à 16 semaines.

Pas de fourchette haute parce que la complexité varie trop : un SaaS d'abonnement simple et un système de gestion multi-utilisateurs ne sont pas comparables.

---

## Le Mobile Money n'est pas un bouton

C'est le point le moins compris du marché.

Intégrer MTN Mobile Money ou Moov sur un site, ce n'est pas "ajouter un bouton de paiement". C'est gérer un flux asynchrone avec des dizaines de cas d'erreur possibles.

Le client initie le paiement → reçoit un prompt USSD → confirme sur son téléphone → l'opérateur envoie un webhook → le site vérifie la signature du webhook → crédite la commande.

Chaque étape peut échouer. Le client peut abandonner à l'étape USSD. L'opérateur peut envoyer le webhook avec du retard. La requête peut arriver deux fois.

Un site qui encaisse des paiements Mobile Money sans gérer ces cas correctement va créditer des commandes non payées — ou refuser des paiements valides. Les deux font perdre de l'argent.

C'est pourquoi l'intégration Mobile Money seule coûte entre 150 000 et 400 000 XOF sur un site existant. Ce n'est pas de la configuration. C'est du développement.

---

## Le délai est une variable de prix déguisée

Un développeur qui promet "livraison en 3 jours" pour un e-commerce complet a inclus ça dans le prix d'une façon ou d'une autre.

Soit il va couper des coins. Soit le prix reflète un travail de nuit. Soit il a un template déjà prêt qu'il va habiller à tes couleurs — et dans 6 mois tu vas te retrouver avec le même site que 40 autres clients.

Le délai réaliste est lié à ce que tu livres.

Les projets qui prennent du retard ne prennent pas du retard à cause du code. Ils prennent du retard parce que le client a mis 3 semaines à envoyer son logo, ses textes, et les photos de ses produits. Le développeur ne peut pas commencer la mise en page sans contenu.

Règle pratique : prépare ton contenu avant de signer.

---

## Comment lire un devis avant de signer

Quatre questions à poser systématiquement.

**Qui héberge le site ?**
La réponse attendue : Vercel, Netlify, ou un hébergeur avec un compte à ton nom. Si c'est sur le compte du prestataire, tu n'es pas propriétaire de ton hébergement.

**Le code source m'appartient-il ?**
Tout prestataire sérieux livre le code source. Si la réponse est non ou évasive, tu paies pour louer — pas pour posséder.

**Qu'est-ce qui est inclus après livraison ?**
Au minimum : 3 mois de corrections de bugs. Au-delà, un contrat de maintenance distinct avec un tarif mensuel clair.

**Le devis inclut-il les taxes ?**
Au Bénin, un prestataire formel facture la TVA (18%). Un devis sans mention de taxes peut dissimuler une surprise à la facture finale.

---

## Ce que ça coûte de ne pas avoir de site

La question est mal posée depuis le début.

"Combien ça coûte" traite le site comme une dépense. Mais un e-commerce qui encaisse 5 commandes par semaine à 25 000 XOF pièce, c'est 500 000 XOF de revenus mensuels qui n'existaient pas avant.

La vraie question n'est pas le coût du site. C'est le coût de l'absence.

Chaque mois sans site, c'est un mois où tes concurrents prennent les clients qui cherchaient quelqu'un comme toi sur Google.

---

Le prix d'un site web au Bénin, c'est le prix de ce qu'il doit faire — pas le prix du fichier HTML.

---

*→ [Tarifs détaillés par type de projet](/tarifs)*
*→ [Ce que j'ai construit : Pixel-Mart, VitrinAI, MomoGate et plus](/projets)*
*→ [Pourquoi les outils d'audit SEO mentent aux entreprises africaines](/articles/article-vitrinai)*
