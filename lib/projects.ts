export type ProjectCategory =
  | "marketplace"
  | "fintech"
  | "saas"
  | "outil"
  | "civic"
  | "media"
  | "agence";

export type ProjectStatus = "production" | "beta" | "open-source" | "livré";

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  impact?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  stack: string[];
  live?: string;
  github?: string;
  npm?: string[];
  screenshot?: string; // path relative to /public
  featured?: boolean;
};

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  marketplace: "Marketplace",
  fintech: "Fintech",
  saas: "SaaS",
  outil: "Outil",
  civic: "Service public",
  media: "Média",
  agence: "Agence",
};

export const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  marketplace: "#c8a86b",
  fintech: "#6bc8a0",
  saas: "#6b8ec8",
  outil: "#a86bc8",
  civic: "#c86b6b",
  media: "#c8a86b",
  agence: "#6b8ec8",
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  production: "En production",
  beta: "Bêta",
  "open-source": "Open source",
  livré: "Livré",
};

export const PROJECTS: Project[] = [
  {
    slug: "pixel-mart",
    name: "Pixel-Mart",
    tagline: "La première marketplace mobile money native du Bénin",
    description:
      "Marketplace B2C pensée pour le consommateur béninois — paiements MTN et Moneroo intégrés dès le premier jour, interface mobile-first, zéro friction au checkout.",
    problem:
      "Les e-commerçants béninois perdaient leurs clients à l'étape du paiement, faute d'options locales. Les solutions existantes exigent une carte Visa que la majorité des acheteurs n'ont pas.",
    solution:
      "Une marketplace complète avec catalogue vendeurs, gestion des commandes et paiements mobile money natifs (MTN via Moneroo). Tableau de bord marchand en temps réel. Construit sur Next.js 15 et Convex pour des mises à jour instantanées sans rechargement.",
    impact:
      "Déployé en production sur pixel-mart-bj.com. Première marketplace béninoise à accepter le paiement MTN Mobile Money nativement au checkout.",
    category: "marketplace",
    status: "production",
    featured: true,
    stack: ["Next.js 15", "Convex", "TypeScript", "Moneroo", "Tailwind"],
    live: "https://pixel-mart-bj.com",
    screenshot: "/projets/pixel-mart.webp",
  },
  {
    slug: "vitrinai",
    name: "VitrinAI",
    tagline: "L'audit de présence digitale conçu pour les PME africaines",
    description:
      "VitrinAI mesure la visibilité de votre site web depuis des serveurs africains — pas parisiens. Score SEO, vitesse 4G, accessibilité mobile, présence Google Maps. Résultat en 30 secondes.",
    problem:
      "Les outils d'audit SEO mesurent les performances depuis des data centers européens. Une PME béninoise peut être invisible sur Google et inutilisable sur 4G Cotonou malgré un score parfait sur GTmetrix Paris.",
    solution:
      "Un outil d'audit web qui teste les sites depuis des points d'accès africains, génère un rapport actionnable en 30 secondes et propose 5 priorités claires. Les résultats sont analysés par des agents IA qui contextualisent chaque recommandation pour le marché local.",
    impact:
      "Utilisé pour auditer plus de 25 sites béninois dans le cadre de la série \"Invisible\" — 30 audits publics de la présence digitale des entreprises du Bénin.",
    category: "outil",
    status: "production",
    featured: true,
    stack: ["Next.js", "Convex", "TypeScript", "Tailwind"],
    github: "https://github.com/aboudou-cto-bloko/vitrinai",
    live: "https://vitrinai-eta.vercel.app",
    screenshot: "/projets/vitrinai.webp",
  },
  {
    slug: "rendezapp",
    name: "RendezApp",
    tagline: "Fini les réservations perdues dans WhatsApp",
    description:
      "RendezApp centralise toutes les réservations en un tableau de bord. Les clients réservent en ligne, le professionnel gère en temps réel. Déjà utilisé dans +15 établissements à Cotonou.",
    problem:
      "Les professionnels béninois (cliniques, salons, cabinets) géraient leurs réservations sur WhatsApp — sans visibilité, sans historique, sans confirmation automatique. Un rendez-vous sur trois se perdait.",
    solution:
      "Une plateforme SaaS avec page de réservation publique par établissement, tableau de bord de gestion en temps réel et notifications automatiques. Les clients réservent depuis le lien ou le QR code, sans télécharger d'application.",
    impact:
      "Déjà adopté dans plus de 15 établissements à Cotonou au lancement. Gratuit sans limite de durée, sans carte bancaire requise.",
    category: "saas",
    status: "production",
    featured: true,
    stack: ["Next.js 14", "Convex", "WhatsApp API", "TypeScript"],
    github: "https://github.com/aboudou-cto-bloko/rendez-app",
    live: "https://rendez-app-kappa.vercel.app/",
    screenshot: "/projets/rendezapp.webp",
  },
  {
    slug: "momo-gate",
    name: "MomoGate",
    tagline: "Votre boutique Shopify accepte les 16 Mobile Money d'Afrique de l'Ouest",
    description:
      "App Shopify qui connecte n'importe quelle boutique aux 16 méthodes Mobile Money d'Afrique de l'Ouest. Paiement initié en 0 clic, reversement automatique, zéro intégration technique.",
    problem:
      "Les marchands Shopify d'Afrique de l'Ouest perdaient des ventes faute d'options de paiement locales. Stripe ne couvre pas MTN, Orange Money ni Wave — les méthodes de paiement que leurs clients utilisent au quotidien.",
    solution:
      "Une app disponible sur le Shopify App Store qui s'intègre au checkout en quelques minutes. Le client voit ses méthodes mobile money habituelles, initie le paiement depuis son téléphone. Reversement automatique côté marchand, webhooks sécurisés, gestion des remboursements.",
    category: "fintech",
    status: "beta",
    featured: true,
    stack: ["Node.js", "TypeScript", "Shopify API"],
    github: "https://github.com/aboudou-cto-bloko/momo-gate",
    live: "https://momo-gate-one.vercel.app/",
    screenshot: "/projets/momo-gate.webp",
  },
  {
    slug: "moneroo-sdk",
    name: "Moneroo SDK",
    tagline: "SDK TypeScript + serveur MCP pour les paiements africains",
    description:
      "Package npm open source pour intégrer l'API Moneroo en 10 lignes de TypeScript — ou depuis un agent IA grâce au serveur MCP.",
    problem:
      "L'API Moneroo n'avait pas de SDK TypeScript. Chaque développeur réécrivait les mêmes requêtes HTTP, la même logique de webhook, les mêmes types. Et aucun agent IA ne pouvait initier un paiement mobile money directement.",
    solution:
      "Un SDK TypeScript complet publié sur npm avec types stricts, validation Zod et gestion d'erreurs. Et un serveur MCP (Model Context Protocol) qui permet à Claude et autres agents IA d'initier des paiements mobile money directement depuis une conversation.",
    impact:
      "Publié sur npm sous les packages `moneroo` et `moneroo-mcp`. Utilisé en production sur Pixel-Mart et PLR Library.",
    category: "outil",
    status: "open-source",
    featured: true,
    stack: ["TypeScript", "Node.js", "MCP"],
    github: "https://github.com/aboudou-cto-bloko/moneroo-tools",
    npm: ["moneroo", "moneroo-mcp"],
  },
  {
    slug: "vaultpay",
    name: "VaultPay",
    tagline: "Envoyez de l'argent en Afrique. Économisez 1 000 $/an.",
    description:
      "Plateforme de transfert d'argent FINTRAC-licenciée pour la diaspora africaine. Virement en Afrique en moins de 60 secondes — 7,50 $ la transaction, pas 45 $.",
    problem:
      "Les membres de la diaspora africaine payaient entre 35 $ et 45 $ de frais par transfert via Western Union ou MoneyGram. Pour quelqu'un qui envoie 200 $/mois à sa famille, ça représente plus de 1 000 $ de frais perdus par an.",
    solution:
      "Une plateforme de transfert sous licence FINTRAC (réglementation canadienne des services financiers), sécurité niveau bancaire, virements en moins de 60 secondes au tarif fixe de 7,50 $ quelle que soit la somme. Landing page avec liste d'attente de 8 200+ membres.",
    impact:
      "8 200+ inscrits sur la liste d'attente avant le lancement. Licencié FINTRAC pour opérer légalement en Amérique du Nord.",
    category: "fintech",
    status: "beta",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    live: "https://vaultpay-landing.vercel.app/",
    screenshot: "/projets/vaultpay.webp",
  },
  {
    slug: "agence-na",
    name: "Nasr & Aboudou",
    tagline: "Des sites qui génèrent des clients, pas des compliments",
    description:
      "Agence web spécialisée dans les sites à forte conversion pour les PME écossaises. Web design, identité de marque, stratégie SEO — livré en 2 semaines.",
    problem:
      "Les PME écossaises avaient des sites vitrines qui n'amenaient aucun client. Beau design, zéro résultat commercial. Leurs concurrents prenaient des parts de marché pendant ce temps.",
    solution:
      "Des sites web orientés conversion, construits vite et livrés avec une stratégie SEO locale intégrée. Chaque page est pensée pour transformer un visiteur en prospect — pas pour impressionner un jury de design.",
    category: "agence",
    status: "production",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    live: "https://agence-na-v1.vercel.app/",
    screenshot: "/projets/agence-na.webp",
  },
  {
    slug: "plr-library",
    name: "PLR Library",
    tagline: "Vendez des produits digitaux. Sans en créer un seul.",
    description:
      "Bibliothèque de ressources numériques à droits de marque privée en abonnement. Les membres téléchargent, personnalisent et revendent légalement 300+ produits digitaux.",
    problem:
      "Les entrepreneurs francophones voulaient vendre des formations, ebooks et templates en ligne — sans passer 6 mois à les créer. Les plateformes PLR anglophones existantes ne proposaient rien en français.",
    solution:
      "Un SaaS d'abonnement avec catalogue de 300+ ressources PLR en français (ebooks, formations, templates), accès par plan d'abonnement et paiements récurrents via Moneroo. Tableau de bord membre, droits de revente inclus, téléchargement illimité.",
    category: "saas",
    status: "production",
    stack: ["Next.js 14", "Convex", "Moneroo", "TypeScript"],
    github: "https://github.com/aboudou-cto-bloko/plr-platform",
    live: "https://plr-platform-xvsgd.vercel.app/",
    screenshot: "/projets/plr-library.webp",
  },
  {
    slug: "bloko",
    name: "BLOKO",
    tagline: "L'escrow qui sécurise les transactions entre inconnus en Afrique",
    description:
      "Plateforme de séquestre en ligne pour le marché africain francophone. L'argent est bloqué jusqu'à confirmation de livraison — éliminant les arnaques dans le commerce en ligne.",
    problem:
      "En Afrique francophone, les arnaques à la livraison et aux acomptes freinent le e-commerce. Sans tiers de confiance numérique, acheteurs et vendeurs se méfient — et les transactions échouent avant même d'avoir lieu.",
    solution:
      "BLOKO joue le rôle de tiers de confiance numérique. L'acheteur dépose les fonds, le vendeur expédie, BLOKO libère le paiement à la confirmation de réception. Intégration FedaPay pour les flux XOF, architecture monorepo Nx pour la scalabilité.",
    category: "fintech",
    status: "production",
    stack: ["Nx", "Next.js 14", "Supabase", "Prisma", "FedaPay", "TypeScript"],
  },
  {
    slug: "zeat",
    name: "ZEAT",
    tagline: "Menu digital QR pour restaurateurs indépendants",
    description:
      "ZEAT permet à un restaurant de passer au menu numérique en quelques minutes — QR code, catalogue de plats, mise à jour instantanée. Sans abonnement mensuel.",
    problem:
      "Les cartes papier coûtent cher à imprimer à chaque changement de menu. Les solutions SaaS de menu digital coûtent entre 30 et 80 €/mois — inabordables pour un restaurateur indépendant à Cotonou.",
    solution:
      "Une application légère où le restaurateur crée son catalogue et génère un QR code. Les clients scannent depuis leur navigateur — sans télécharger d'application. Modifications en temps réel via Convex.",
    category: "saas",
    status: "production",
    stack: ["Next.js", "Convex", "TypeScript", "Tailwind"],
    github: "https://github.com/aboudou-cto-bloko/zeat",
  },
  {
    slug: "campus-plus",
    name: "Campus+",
    tagline: "Le média étudiant nouvelle génération pour les campus béninois",
    description:
      "Plateforme numérique qui centralise l'actualité, les talents et les opportunités des universités béninoises. Par les étudiants, pour les étudiants.",
    problem:
      "Les étudiants des campus béninois (ENEAM, EPAC, UAC, FASEG) n'avaient pas de point d'entrée unique pour l'actualité de leur école, les offres de stage, ou les événements. L'information était dispersée sur des groupes WhatsApp non centralisés.",
    solution:
      "Un média web avec landing cinématique (vidéo background, kinetic text), formulaire de recrutement de contributeurs et recueil des voix étudiantes via Convex en temps réel. Architecture mobile-first conçue pour les connexions campus.",
    category: "media",
    status: "beta",
    stack: ["Next.js", "Convex", "TypeScript", "Tailwind"],
    screenshot: "/projets/campus-plus.webp",
  },
  {
    slug: "kamgoko",
    name: "Kamgoko",
    tagline: "Dématérialisation des actes d'état civil — Mairie de Cotonou",
    description:
      "Système de gestion électronique des actes d'état civil développé pour la Mairie de Cotonou. Remplace les registres papier par une base sécurisée avec contrôle d'accès par rôle.",
    problem:
      "La mairie gérait naissances, mariages et décès sur des registres papier — difficiles à consulter, exposés à la perte et impossibles à dupliquer. La recherche d'un acte prenait des heures.",
    solution:
      "Une application web PHP natif déployée sur les serveurs municipaux — sans dépendance cloud. Saisie des actes, recherche multicritère, impression officielle, gestion des droits par rôle (agent, superviseur, administrateur). Architecture MVC sans framework externe pour faciliter la maintenance interne.",
    category: "civic",
    status: "livré",
    stack: ["PHP 8.2", "MySQL 8"],
    github: "https://github.com/aboudou-cto-bloko/etat-civil-cotonou",
  },
];

export function getProjectBySlug(slug: string): Project | null {
  return PROJECTS.find((p) => p.slug === slug) ?? null;
}

export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter((p) => p.featured);
}
