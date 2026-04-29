---
title: "Comment j'ai construit ce site — pipeline Brain → site"
date: 2026-04-29
tags: [next.js, cms, markdown, brain, pipeline, remark]
status: published
description: "Architecture du site : CMS markdown, résolution de liens croisés, et le workflow pour passer d'un draft Obsidian à un post publié."
related:
  - article-workflow-claude-code
---

# Comment j'ai construit ce site — pipeline Brain → site

Ce site n'a pas de back-office. Pas de base de données. Pas de CMS externe.

Le CMS, c'est mon Second Brain — un vault Obsidian dans `~/Brain/`.

---

## Le principe

Chaque article que tu lis ici a commencé comme une note Markdown dans mon cerveau numérique.

Le pipeline :

```
~/Brain/projets/portfolio/drafts/  →  content/<section>/  →  git push  →  Vercel
```

Copier un fichier, commit, push. Le post est live en 60 secondes.

---

## Pourquoi pas un vrai CMS

Sanity, Contentful, Notion API, Strapi — j'ai évalué.

La contrainte réelle : je produis du contenu depuis Brain de toute façon. Mes notes sont déjà en Markdown, déjà structurées, déjà cross-linkées. Un CMS externe crée une friction supplémentaire pour zéro gain.

Un fichier `.md` sur le système de fichiers, c'est :
- Versionnable avec git
- Ouvrable dans n'importe quel éditeur
- Lisible sans internet
- Gratuit

---

## La résolution des liens croisés

Le problème : dans Brain, les liens entre notes s'écrivent naturellement.

```markdown
Voir [La règle F-01](./f01-regle-balance.md) pour le pattern complet.
```

Sur le site, ce lien doit devenir `/insights/f01-regle-balance`. Pas `./f01-regle-balance.md`.

J'ai construit un plugin remark (`remarkResolveLinks`) qui :
1. Construit un manifest de tous les posts au build : `slug → Post`
2. Intercepte les noeuds `link` avec des chemins relatifs `.md`
3. Remplace l'URL par la route Next.js correcte

```typescript
visit(tree, "link", (node: Link) => {
  if (!/^\.\.?\//i.test(node.url)) return;
  const filename = node.url.split("/").pop() ?? "";
  const post = manifest.get(filename);
  if (post) node.url = post.url;
});
```

Résultat : j'écris mes cross-links dans Brain exactement comme je les écrirais dans Obsidian. Ils fonctionnent sur le site sans aucune modification.

---

## Le slug

Les fichiers Brain utilisent un préfixe de date : `20260429-1100-article-moneroo-sdk.md`.

Je ne veux pas cette date dans l'URL. `/articles/20260429-1100-article-moneroo-sdk` est illisible.

`toSlug()` supprime le préfixe :

```typescript
function toSlug(filename: string): string {
  return filename
    .replace(/\.(md|mdx)$/, "")
    .replace(/^\d{8}-\d{4}-/, "");
}
```

URL finale : `/articles/article-moneroo-sdk`. Propre.

---

## Le frontmatter

Chaque fichier `.md` commence par un bloc YAML.

```yaml
---
title: "XOF n'a pas de centimes — le bug qui m'a coûté 3h"
date: 2026-04-29
topic: paiements
order: 1
tags: [moneroo, xof, devises, bug]
status: published
related:
  - f01-regle-balance
---
```

`topic` et `order` classent les insights en groupes sur la page `/insights`.  
`related` est résolu en objets `Post` complets — rendu en section "Voir aussi" sous l'article.  
`status: archived` retire un post des listings sans supprimer l'URL.

---

## Le bug de tri

Gray-matter parse `date: 2026-04-29` en objet `Date`, pas en string.

Mon premier tri utilisait `.localeCompare()`. Ça n'explose pas immédiatement — `Date.localeCompare` retourne `undefined`, ce qui passe silencieusement en dev et désordonne les posts en production.

La version correcte :

```typescript
const da = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0;
const db = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0;
return db - da;
```

Toujours convertir en timestamp avant de comparer des dates YAML.

---

## Le design

Inspiré de nav.al/archive. Noir. Blanc. Rien d'autre.

Palette complète :
- Fond : `#090909`
- Texte : `#f0f0f0`
- Méta : `#888888`
- Séparateurs : `#333333`

Police : Jost 300/400/500. Zéro icon. Zéro image de décoration.

La contrainte de conception : si tu retires tout ce qui n'est pas du texte, est-ce que l'information reste lisible ? Sur ce site, la réponse est oui.

---

## Le workflow complet

1. Écrire le draft dans `~/Brain/projets/portfolio/drafts/`
2. Ajouter le frontmatter (title, date, status, tags, related)
3. Copier dans `content/<section>/`
4. `git add content/ && git commit -m "contenu: ..." && git push`

C'est tout.

Vercel détecte le push, rebuild le site en SSG, déploie. Chaque page est générée statiquement à partir des fichiers Markdown via `generateStaticParams`.

---

La vraie valeur ici n'est pas le site. C'est que le pipeline coûte zéro friction.

Si publier est difficile, tu ne publies pas. Si publier est facile, tu publies plus souvent.
