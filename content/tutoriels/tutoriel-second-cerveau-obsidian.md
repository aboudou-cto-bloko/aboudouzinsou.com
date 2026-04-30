---
title: "Construire un second cerveau avec Obsidian — du chaos des notes à une base de connaissance vivante"
format: tutoriel
status: published
tags: [obsidian, pkm, notes, brain, zettelkasten, para, knowledge-management, bash]
date: 2026-04-30
created: 2026-04-30
updated: 2026-04-30
related:
  - tutoriel-hub-cli-workstation
  - tutoriel-brain-assistant-rag
---

# Construire un second cerveau avec Obsidian — du chaos des notes à une base de connaissance vivante

Le problème n'est pas le manque d'information. C'est de ne plus retrouver ce qu'on a appris.

Tu lis un article technique sur les embeddings, tu prends une note quelque part. Six mois plus tard, tu réimplémente la même chose depuis zéro parce que tu ne te souviens plus où tu avais mis ça.

Un second cerveau, c'est la solution : un système externe où l'information est organisée de façon à être retrouvée et réutilisée, pas juste stockée.

Ce tutoriel détaille comment j'ai construit `Brain/` — un vault Obsidian sur Debian qui couvre mes projets, mes ressources techniques, mes notes atomiques, et se connecte à mon CLI et à mon assistant IA.

> **Prérequis :** Obsidian installé, notions de Markdown, Linux ou macOS.
> **Outil principal :** [Obsidian](https://obsidian.md) — éditeur de notes local basé sur des fichiers Markdown.

---

## Ce qu'on construit

```
~/Brain/
├── projets/          Notes de projets actifs (un dossier par projet)
├── ressources/       Snippets, prompts, outils, business
├── notes/            Notes atomiques + journal quotidien
├── _systeme/
│   ├── sessions/     Notes de sessions IA (générées automatiquement)
│   ├── moc/          Maps of Content — index thématiques
│   └── templates/    Templates réutilisables
└── archives/         Contenus archivés
```

Un seul vault. Une structure stable. Des connexions plutôt que des hiérarchies profondes.

---

## 1. Pourquoi Obsidian

Obsidian a deux propriétés rares parmi les outils de notes :

**Les fichiers t'appartiennent.** Tout est du Markdown local. Pas de base de données propriétaire, pas de dépendance à un serveur, pas de lock-in. Tu peux ouvrir n'importe quelle note dans un éditeur de texte, la parser en Python, la committer dans Git, ou l'indexer dans un RAG.

**Les liens sont des citoyens de première classe.** `[[nom-de-la-note]]` crée un lien bidirectionnel. La note liée sait qu'on la référence. Le graph view visualise ces connexions. C'est la différence entre un fichier system et un réseau de connaissances.

> **Documentation :** [help.obsidian.md](https://help.obsidian.md) — toute la documentation officielle, notamment la section sur les [wikilinks](https://help.obsidian.md/Linking+notes+and+files/Internal+links).

---

## 2. La structure PARA adaptée

[PARA](https://fortelabs.com/blog/para/) (Projects, Areas, Resources, Archives) est un système de classement par utilisabilité, pas par sujet. J'en ai gardé l'esprit en l'adaptant :

| Dossier | PARA original | Ma version |
|---------|--------------|------------|
| `projets/` | Projects | Notes des projets actifs uniquement |
| `ressources/` | Resources | Snippets, prompts réutilisables, outils |
| `notes/` | Areas + Notes | Notes atomiques + journal quotidien |
| `_systeme/` | — | Infrastructure du vault (templates, MOC, sessions) |
| `archives/` | Archives | Tout ce qui n'est plus actif |

**Règle clé :** Un projet a un dossier dans `projets/` tant qu'il est actif. Quand il est terminé ou en pause longue, il migre dans `archives/projets/`. Cette friction volontaire garde `projets/` petit et pertinent.

> **Référence :** [Building a Second Brain (livre)](https://www.buildingasecondbrain.com/) de Tiago Forte — théorie complète derrière PARA et CODE (Capture, Organize, Distill, Express).

---

## 3. Les notes atomiques

Une note atomique = une seule idée, développée complètement.

Pas "tout ce que je sais sur les embeddings" — plutôt "pourquoi les embeddings multilingues ont une représentation vectorielle partagée".

Ce principe vient du [Zettelkasten](https://zettelkasten.de/introduction/) de Niklas Luhmann — un système de fiches papier où chaque idée est autonome et reliée aux autres par des références explicites.

```markdown
---
title: "Embeddings multilingues — représentation partagée"
type: note-atomique
tags: [ia, embeddings, nlp]
created: "2026-04-15"
---

Un modèle comme `paraphrase-multilingual-MiniLM-L12-v2` projette des phrases
de 50+ langues dans le même espace vectoriel.

"Chat en français" et "Cat in English" donnent des vecteurs proches
parce que le modèle a appris leurs équivalences sémantiques.

Conséquence : un RAG indexé en français est interrogeable en anglais
sans aucune traduction intermédiaire.

→ [[tutoriel-brain-assistant-rag]] — comment j'exploite ça dans mon assistant
```

**Pourquoi c'est mieux qu'une note fourre-tout :** Quand tu relies deux notes atomiques, tu crées une connexion explicite entre deux idées. Cette connexion devient une troisième connaissance implicite. C'est ce que le graph view rend visible.

---

## 4. Le format des fichiers

Toutes les notes suivent une convention de nommage :

```
YYYYMMDD-HHmm-slug.md
```

Exemples :
```
20260415-1430-embeddings-multilingues.md
20260428-0900-retour-pixelmart-stripe.md
20260430-1100-clarity-facebook-os.md
```

**Pourquoi ce format :**
- Tri chronologique naturel dans n'importe quel explorateur de fichiers
- Unicité garantie (date + heure)
- Slug lisible pour les humains
- Compatible avec un RAG — le timestamp devient une métadonnée d'indexation

Le frontmatter YAML minimal :

```yaml
---
title: "Titre lisible de la note"
type: note-atomique     # ou projet, ressource, journal, session
tags: [tag1, tag2]
created: "2026-04-30"   # Toujours entre guillemets pour éviter les erreurs YAML
---
```

> **Attention :** Les dates YAML sans guillemets (`created: 2026-04-30`) peuvent être parsées comme des objets date dans certains parsers Python, causant des erreurs `unhashable type`. Toujours utiliser `created: "2026-04-30"`.

---

## 5. Les templates

Obsidian supporte les templates via le plugin [Templater](https://github.com/SilentVoid13/Templater) (communauté) ou le plugin Templates natif. J'utilise des fichiers Markdown dans `_systeme/templates/` que je copie manuellement via `hub brain new`.

Template pour une note de projet :

```markdown
---
title: "{{title}}"
type: projet
status: actif
tags: []
created: "{{date:YYYY-MM-DD}}"
updated: "{{date:YYYY-MM-DD}}"
---

## Contexte

_Pourquoi ce projet existe._

## Objectifs

- [ ] 

## Journal

### {{date:YYYY-MM-DD}}

_Premier log._

## Décisions

## Ressources liées
```

Template pour une note de session IA (générée automatiquement par le hook Claude Code) :

```markdown
---
title: "Session IA — {{date:YYYY-MM-DD HH:mm}}"
type: session
tags: [ia, session]
created: "{{date:YYYY-MM-DD}}"
---

## Résumé

## Fichiers modifiés

## Décisions importantes

## Notes
```

> **Documentation Templater :** [silentvoid13.github.io/Templater](https://silentvoid13.github.io/Templater/) — le plugin le plus puissant pour l'automatisation de templates dans Obsidian.

---

## 6. Les Maps of Content (MOC)

Une MOC est une note-index : elle liste et contextualise les notes sur un sujet donné, sans dupliquer leur contenu.

```markdown
---
title: "MOC — Intelligence Artificielle"
type: moc
tags: [ia, moc]
---

## Fondamentaux

- [[embeddings-multilingues]] — représentation vectorielle partagée
- [[rag-architecture]] — retrieval-augmented generation, principes
- [[llm-routing]] — choisir le bon modèle selon la tâche

## Implémentations

- [[tutoriel-brain-assistant-rag]] — mon assistant RAG personnel
- [[brain-indexer-chromadb]] — indexation du vault

## Lectures

- [[note-attention-is-all-you-need]] — papier fondateur des transformers
```

Les MOC ne remplacent pas les dossiers — elles les traversent. Une note peut apparaître dans plusieurs MOC sans être dupliquée.

---

## 7. Connexion au CLI hub

Le vault est navigable depuis le terminal via `hub brain` :

```bash
# Dans hub — extrait simplifié
BRAIN_DIR="$HOME/Brain"

cmd_brain() {
  local sub="${1:-}"
  case "$sub" in
    search) _brain_search "${2:-}" ;;
    new)    _brain_new "${@:2}" ;;
    today)  _brain_today ;;
    stats)  _brain_stats ;;
    "")     _fzf_pick_brain ;;
  esac
}

_brain_search() {
  local query="${1:-}"
  [ -z "$query" ] && { _err "Usage: hub brain search <terme>"; return 1; }
  grep -r --include="*.md" -l "$query" "$BRAIN_DIR" \
    | sed "s|$BRAIN_DIR/||" \
    | fzf --preview="bat --style=plain {}" \
         --bind="enter:execute(nvim '$BRAIN_DIR/{}')"
}

_brain_today() {
  local today; today=$(date +%Y%m%d-%H%M)
  local path="$BRAIN_DIR/notes/${today}-journal.md"
  [ ! -f "$path" ] && cp "$BRAIN_DIR/_systeme/templates/tpl-journal.md" "$path"
  ${EDITOR:-nvim} "$path"
}
```

`hub brain search "embeddings"` → `grep` récursif → résultats filtrés via fzf → ouverture dans Neovim.

> **Voir aussi :** [hub go et la navigation de dossiers](./tutoriel-hub-cli-workstation.md) — le même pattern de wrapper zsh.

---

## 8. Intégration avec Claude Code (hook Stop)

Le hook Stop de Claude Code génère automatiquement une note de session dans `_systeme/sessions/` à la fin de chaque session significative.

Script `~/Scripts/brain-session.sh` :

```bash
#!/usr/bin/env bash
set -euo pipefail

BRAIN_DIR="$HOME/Brain"
SESSIONS_DIR="$BRAIN_DIR/_systeme/sessions"
TEMPLATE="$BRAIN_DIR/_systeme/templates/tpl-session.md"

timestamp=$(date +%Y%m%d-%H%M)
slug="session-claude-${timestamp}"
output="$SESSIONS_DIR/${timestamp}-${slug}.md"

mkdir -p "$SESSIONS_DIR"
cp "$TEMPLATE" "$output"

date_today=$(date +%Y-%m-%d)
sed -i "s/{{date:YYYY-MM-DD}}/$date_today/g" "$output"
sed -i "s/{{date:YYYY-MM-DD HH:mm}}/$(date '+%Y-%m-%d %H:%M')/g" "$output"

echo "Session Brain créée : $output"
```

Configuration dans `.claude/settings.json` :

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/Scripts/brain-session.sh"
          }
        ]
      }
    ]
  }
}
```

Chaque fin de session Claude Code crée une note structurée, prête à être enrichie manuellement avec les décisions et apprentissages de la session.

---

## 9. Les 7 non-négociables

Ces règles maintiennent le vault utilisable sur le long terme :

1. **Une note = une idée.** Si tu dois ajouter une section H2 "Autre sujet", crée une deuxième note et lie-les.

2. **Toujours un frontmatter YAML complet.** `title`, `type`, `tags`, `created` — pas d'exception. Un parser ne peut pas exploiter ce qu'il ne trouve pas.

3. **Dates entre guillemets.** `created: "2026-04-30"` — jamais `created: 2026-04-30`. Évite les erreurs de parsing YAML dans Python/Ruby.

4. **Liens internes plutôt que dossiers profonds.** Avant de créer un sous-dossier, demande-toi si un `[[lien]]` et une MOC suffisent.

5. **Archive plutôt que supprime.** Un projet terminé va dans `archives/`, pas à la corbeille. Le contexte passé a de la valeur.

6. **Ne jamais réindexer à la main.** Si quelque chose doit être retrouvable, il a un tag ou un lien. Sinon, il n'existe pas pour le cerveau.

7. **Une session = une note.** Chaque session Claude Code, chaque projet, chaque décision importante a sa trace écrite.

---

## 10. Tips et pièges courants

**Ne pas commencer par la structure.** Commence par noter. La structure émerge des patterns de tes notes, pas l'inverse.

**fzf + ripgrep pour chercher dans le vault.**

```bash
rg --type md -l "terme" ~/Brain/ | fzf --preview="bat --color=always {}"
```

[ripgrep](https://github.com/BurntSushi/ripgrep) est 10× plus rapide que `grep` sur de grands vaults.

**Git pour l'historique du vault.**

```bash
cd ~/Brain && git init
echo ".obsidian/workspace*" >> .gitignore
git add . && git commit -m "init: vault Brain"
```

Git + Obsidian = snapshot de ton cerveau à n'importe quel point dans le temps.

**Le graph view ne sert pas à naviguer.** Il sert à *diagnostiquer* — des notes isolées (sans liens entrants) sont souvent des notes orphelines à relier ou archiver.

**Utiliser `bat` plutôt que `cat` pour prévisualiser.**

```bash
# Dans ~/.zshrc
alias cat='bat --style=plain'
```

[bat](https://github.com/sharkdp/bat) ajoute la coloration syntaxique Markdown dans le terminal.

---

## Structure finale

```
~/Brain/
├── projets/
│   ├── bloko/
│   ├── pixelmart/
│   └── portfolio/
│       └── drafts/        ← Articles en cours
├── ressources/
│   ├── snippets/
│   ├── prompts/
│   └── outils/
├── notes/
│   ├── 20260430-1100-*.md
│   └── journal/
├── _systeme/
│   ├── sessions/          ← Auto-générées par hook Claude Code
│   ├── moc/
│   └── templates/
└── archives/
```

---

## Ressources

- [Obsidian Help](https://help.obsidian.md) — documentation officielle complète
- [Building a Second Brain](https://www.buildingasecondbrain.com/) — Tiago Forte, le livre de référence
- [Zettelkasten.de](https://zettelkasten.de/introduction/) — introduction à la méthode des notes atomiques
- [Templater plugin](https://silentvoid13.github.io/Templater/) — templates dynamiques pour Obsidian
- [ripgrep](https://github.com/BurntSushi/ripgrep) — recherche ultra-rapide dans les fichiers texte
- [bat](https://github.com/sharkdp/bat) — cat avec coloration syntaxique

---

*→ [Le CLI qui pilote ce Brain depuis le terminal](./tutoriel-hub-cli-workstation.md)*
*→ [L'assistant IA construit par-dessus ce vault](./tutoriel-brain-assistant-rag.md)*
