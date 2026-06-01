---
title: "Conception UX d'un portfolio développeur : animations, typographie et décisions de design"
date: 2026-04-29
tags: [design, ux, next.js, framer-motion, tailwind, turso, sqlite, site-perso]
status: published
description: "Architecture UX et décisions de design du site : de l'inspiration Naval à la recherche modale, en passant par les animations Framer Motion et la base de données SQLite pour les vues."
related:
  - devlog-pipeline-site-perso
---

# Comment ce site a été conçu

Le pipeline CMS est documenté ailleurs. Ce post parle des décisions de design et d'UX — pourquoi chaque fonctionnalité existe, comment elle a été construite.

---

## Le point de départ : nav.al/archive

L'inspiration principale est la page archive de Naval Ravikant. Noir. Blanc. Texte. Rien d'autre.

Le principe : si tu retires tout ce qui n'est pas du texte, est-ce que l'information reste lisible ? Ici, la réponse est oui.

Palette complète :
- Fond : `#090909`
- Texte : `#f0f0f0`
- Méta : `#888888`
- Séparateurs : `#1e1e1e` / `#333333`

Police unique : **Jost** en graisse 300/400/500. Monospace : **JetBrains Mono** pour le code uniquement.

---

## La tagline d'accueil

La première version affichait juste une liste de posts. Aucun contexte. Aucune invitation.

La version actuelle s'inspire du style Twitter : une phrase courte qui donne l'identité, une sous-ligne de contexte, et une invitation explicite à comprendre pourquoi ce site existe.

```
Je construis.
J'écris ce que j'apprends.

Builder SaaS · Cotonou, Bénin · Marché africain francophone
Journal public d'un dev qui fait, pas qui enseigne.
```

Minimaliste. Pas de hero image. Pas de bouton CTA.

---

## Le feed avec "charger plus"

Le problème initial : la page d'accueil affichait tous les posts d'un coup. Pas de pagination. Pas de fin. Juste une liste qui grossissait.

Solution : `PostFeed` est un composant client avec `PAGE_SIZE = 12`. Il affiche 12 posts, puis un bouton "Voir plus" qui en charge 12 autres, avec une animation d'apparition sur chaque nouveau lot.

```typescript
const PAGE_SIZE = 12;
const [visible, setVisible] = useState(PAGE_SIZE);
```

Pas de pagination. Pas de route. Juste un état local.

---

## Les aperçus sur les listes

Chaque post dans les listes affiche maintenant un extrait. `getExcerpt()` dans `lib/content.ts` :
1. Utilise `description` du frontmatter si elle existe
2. Sinon, strip les headings, code blocks, liens, markdown — prend les 130 premiers caractères

Ce strip est important. Un extrait qui commence par `## Introduction` ou `` `const x = ` `` ne donne aucune information. Seul le texte brut compte.

---

## La recherche

**Défi architectural** : le Nav est un Server Component. La SearchModal est un Client Component. Ils ne peuvent pas partager d'état directement.

Solution : découplage par événements custom.

```typescript
// NavSearchTrigger.tsx (client)
window.dispatchEvent(new CustomEvent("open-search"));

// SearchModal.tsx (client)
window.addEventListener("open-search", () => setOpen(true));
```

La modale écoute aussi `⌘K` / `Ctrl+K` et `Escape`.

L'index de recherche vient d'une route API `/api/search` qui retourne tous les posts avec titre, description, excerpt et tags. La recherche est client-side sur ce JSON — pas besoin d'Algolia pour 50 posts.

**Bug Framer Motion** : la modale utilisait `left: 50%; transform: translateX(-50%)` pour le centrage. Framer Motion écrase le `transform` inline avec ses propres animations (`y`, `scale`). Le fix : `left: 0; right: 0; margin-inline: auto`. Zéro CSS transform — Framer Motion fait ce qu'il veut.

---

## Les animations

Stack : **Framer Motion v12** (`motion/react`).

### Entrée/sortie de page

`app/template.tsx` — Next.js re-render ce fichier à chaque navigation.

```typescript
<motion.div
  initial={{ opacity: 0, y: 6 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -6 }}
  transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
>
```

Avec un `useEffect` pour reset le scroll en haut de page à chaque navigation :

```typescript
useEffect(() => {
  window.scrollTo({ top: 0, behavior: "instant" });
}, []);
```

### Le bouton ↑

Circulaire, fixé en bas au centre (`left: 0; right: 0; margin-inline: auto`), apparaît après 400px de scroll. `AnimatePresence` gère l'entrée/sortie.

### La navigation FAB

Trois boutons circulaires en bas à droite : recherche, accueil, liens. Les liens s'ouvrent dans un bottom sheet avec un spring animation (`stiffness: 380, damping: 38`).

---

## Le widget "Voir aussi"

Sur les articles, un widget flottant translucide affiche les articles liés. Il apparaît quand le header de l'article sort du viewport — détecté par `IntersectionObserver`.

```typescript
const observer = new IntersectionObserver(
  ([entry]) => setVisible(!entry.isIntersecting),
  { threshold: 0 }
);
observer.observe(headerEl);
```

Le widget est collapsible. Il se souvient de son état ouvert/fermé dans le state local.

---

## Le compteur de vues et les likes

**Pourquoi ne pas utiliser node:sqlite** : le built-in `node:sqlite` existe depuis Node.js 22.5. Vercel tourne sur Node.js 18/20. Incompatible en production.

**Solution : Turso** (`@libsql/client`). SQLite-compatible, JS pur, gratuit pour un site perso. En local : `file:.data/site.db`. En prod : `libsql://nom.turso.io`.

Schéma minimal :

```sql
CREATE TABLE IF NOT EXISTS stats (
  slug TEXT PRIMARY KEY,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0
)
```

Les routes API :
- `GET /api/views/[slug]` — compte une vue + retourne le total
- `GET /api/likes/[slug]` — lit le nombre de likes
- `POST /api/likes/[slug]` — toggle like/unlike

**Optimisation fetch** : `PostStats` est affiché N fois sur la page de liste. Une route `/api/stats/all` retourne tout en une requête. Le composant utilise un cache module-level :

```typescript
let _cache: Record<string, Stats> | null = null;
let _promise: Promise<void> | null = null;
```

N instances = 1 requête HTTP.

---

## La syntaxe colorée

`rehype-pretty-code` avec le thème `one-dark-pro` de Shiki. `keepBackground: true` préserve le fond du thème.

Un label de langage apparaît en haut à gauche de chaque bloc :

```css
.prose pre[data-language]::before {
  content: attr(data-language);
  /* ... */
}
```

Sur mobile, le code déborde légèrement du container (`margin-inline: -1.25rem`) pour utiliser toute la largeur de l'écran.

---

## Ce que j'aurais fait différemment

**Turso dès le départ.** J'ai d'abord essayé `better-sqlite3` (échec — bindings natifs bloqués par pnpm v10), puis `node:sqlite` (échec — Node.js 22 uniquement). Deux aller-retours pour arriver à la solution évidente.

**Tester Framer Motion + CSS transform en amont.** La résolution du conflit `transform: translateX(-50%)` a pris du temps. La règle est simple : ne jamais mélanger CSS transform et Framer Motion sur le même élément.

---

Le site complet a été construit en une session de travail avec Claude Code. La stack complète, les animations, la base de données, la recherche — tout en partant de zéro.
