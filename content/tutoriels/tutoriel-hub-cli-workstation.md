---
title: "CLI personnel en Bash : gérer son workstation Linux depuis le terminal (guide complet)"
format: tutoriel
status: published
tags: [bash, cli, terminal, zsh, fzf, docker, workstation, linux, outils]
tldr: "Tutoriel pour construire un CLI Bash personnel : router principal case/esac avec shift, couleurs ANSI, menus interactifs fzf, spinner pour les longues opérations, gestion Docker déclarative, et wrapper zsh pour le cd dans le shell parent."
takeaways:
  - "Pattern dual : sans argument → menu fzf interactif. Avec argument → exécution directe. Les deux coexistent"
  - "`cd` dans une fonction Bash affecte tout le script — toujours utiliser un subshell `(cd dir && cmd)`"
  - "`set -euo pipefail` en tête — -e stoppe sur erreur, -u sur variable non définie, -o pipefail dans les pipes"
  - "La navigation `hub go` dans le shell parent nécessite un wrapper zsh qui capture le stdout du script"
date: 2026-04-30
created: 2026-04-30
updated: 2026-04-30
related:
  - tutoriel-second-cerveau-obsidian
  - tutoriel-brain-assistant-rag
---

# Construire un CLI personnel en Bash — gérer son workstation depuis le terminal

La plupart des développeurs ont des dizaines d'alias dans leur `.zshrc`.

Le problème : des alias, tu ne les retrouves plus. Un alias sans doc devient un mystère après trois semaines. Et tu ne peux pas combiner plusieurs opérations sans écrire un nouveau script à la volée.

Un CLI personnel, c'est la solution. Une seule commande, des sous-commandes bien nommées, un système qui s'auto-documente.

Ce tutoriel détaille comment j'ai construit `hub` — le CLI qui gère mon workstation Debian : mises à jour, Docker, second cerveau, navigation de dossiers, et plus.

> **Prérequis :** Bash 5+, connaissance de base des scripts shell, Linux ou macOS.
> **Code source :** `~/.local/bin/hub` — un seul fichier Bash de ~1 400 lignes.

---

## Ce qu'on construit

```
hub                    # dashboard RAM/disk/containers
hub update             # mettre à jour apt + flatpak + npm + pip
hub docker up penpot   # démarrer un service Docker
hub brain search "rag" # chercher dans le second cerveau
hub go bloko           # naviguer vers ~/projects/bloko-platform
hub sys clean          # nettoyer journaux + cache apt
```

Un seul point d'entrée. Des sous-commandes intuitives. Interface interactive via fzf quand aucun argument n'est fourni.

---

## 1. La structure d'un CLI Bash

Un CLI Bash bien construit repose sur un **router principal** qui distribue vers des fonctions dédiées.

```bash
#!/usr/bin/env bash
set -euo pipefail

# ── Router principal ──────────────────────────────────────────
main() {
  local cmd="${1:-}"; shift 2>/dev/null || true

  case "$cmd" in
    ""|-d|dashboard) cmd_dashboard ;;
    update|up)       cmd_update "$@" ;;
    docker|dk)       cmd_docker "$@" ;;
    brain|br)        cmd_brain "$@" ;;
    go|cd)           cmd_go "$@" ;;
    sys|system)      cmd_sys "$@" ;;
    help|-h|--help)  cmd_help ;;
    *)
      _err "Commande inconnue: $cmd"
      exit 1
      ;;
  esac
}

main "$@"
```

Ce pattern — `case/esac` sur `$1` avec `shift` — permet de passer les arguments restants à la sous-commande. `cmd_docker "$@"` reçoit alors `up penpot` si tu tapes `hub docker up penpot`.

> **Pourquoi `shift 2>/dev/null || true` ?** Si l'utilisateur tape juste `hub` sans argument, `shift` échouerait sur un tableau vide. `|| true` empêche `set -e` de tuer le script.

---

## 2. Système de couleurs et UI terminal

Une interface terminal lisible repose sur des codes ANSI cohérents. Définis-les une fois en haut du fichier.

```bash
# ── Couleurs ──────────────────────────────────────────────────
R=$'\033[0;31m'   # Rouge — erreur
G=$'\033[0;32m'   # Vert — succès
Y=$'\033[1;33m'   # Jaune — avertissement
B=$'\033[0;34m'   # Bleu — titre
C=$'\033[0;36m'   # Cyan — info
D=$'\033[2m'      # Dim — metadata
N=$'\033[0m'      # Reset
BOLD=$'\033[1m'

# ── Helpers d'affichage ───────────────────────────────────────
_ok()   { echo -e "  ${G}✓${N}  $*"; }
_err()  { echo -e "  ${R}✗${N}  $*" >&2; }
_warn() { echo -e "  ${Y}!${N}  $*"; }
_info() { echo -e "  ${C}→${N}  $*"; }
_line() { printf "${D}%s${N}\n" "$(printf '─%.0s' {1..58})"; }
```

Utilisation :

```bash
_ok "Service démarré"
_err "Fichier introuvable"
_info "Chargement en cours..."
```

> **Tip :** Utilise `>&2` pour les erreurs. Elles vont sur stderr, pas stdout — tes pipes restent propres.

---

## 3. Menus interactifs avec fzf

[fzf](https://github.com/junegunn/fzf) est un fuzzy finder CLI. Il prend du texte sur stdin et retourne la ligne sélectionnée.

```bash
_fzf_pick() {
  local prompt="${1:-Choisir}"
  shift
  if command -v fzf &>/dev/null; then
    printf '%s\n' "$@" | fzf \
      --prompt="  ${prompt}: " \
      --height=40% \
      --border=rounded \
      --margin=1,2 \
      --no-info \
      --pointer='›' \
      2>/dev/null || true
  else
    # Fallback sans fzf
    select opt in "$@"; do echo "$opt"; break; done
  fi
}
```

Utilisation dans une sous-commande :

```bash
cmd_docker() {
  local sub="${1:-}"
  if [ -z "$sub" ]; then
    local choice
    choice=$(_fzf_pick "Action" \
      "▶  up      — Démarrer un service" \
      "■  down    — Arrêter un service" \
      "📋 status  — État des containers")
    case "$choice" in
      *up*)   _docker_up ;;
      *down*) _docker_down ;;
      *status*) _docker_status ;;
    esac
    return
  fi
  # Mode direct : hub docker up penpot
  case "$sub" in
    up)   _docker_up "${2:-}" ;;
    down) _docker_down "${2:-}" ;;
    *) _err "Sous-commande inconnue: $sub" ;;
  esac
}
```

Le pattern : si pas d'argument → menu interactif fzf. Si argument → exécution directe. Les deux modes coexistent.

> **Documentation fzf :** [github.com/junegunn/fzf](https://github.com/junegunn/fzf) — la section `--bind` permet d'ajouter des raccourcis clavier dans les menus.

---

## 4. Spinner pour les opérations longues

Les opérations qui prennent plusieurs secondes ont besoin de feedback visuel.

```bash
_spinner() {
  local pid=$1 msg="${2:-Chargement}"
  local chars='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
  local i=0
  while kill -0 "$pid" 2>/dev/null; do
    printf "\r  ${C}%s${N}  %s  " "${chars:$((i % ${#chars})):1}" "$msg"
    sleep 0.1
    ((i++))
  done
  printf "\r%-60s\r" " "
}
```

Utilisation :

```bash
(sudo apt upgrade -y) &
_spinner $! "Mise à jour apt..."
wait
_ok "Mise à jour terminée"
```

Le processus s'exécute en arrière-plan (`&`). `_spinner` tourne tant que le PID existe. `wait` attend la fin proprement.

> **Attention :** `set -e` peut interagir avec les sous-shells en arrière-plan. Si la commande longue peut échouer, ajoute `|| true` après.

---

## 5. Gestion Docker avec des services enregistrés

Déclare tes services dans une `declare -A` au début du fichier.

```bash
declare -A DOCKER_SERVICES=(
  [penpot]="$HOME/penpot|http://localhost:9001|Design UI"
  [listmonk]="$HOME/listmonk|http://localhost:9002|Email marketing"
)
```

Format : `path|url|description`. Séparateur `|` pour faciliter le parsing avec `IFS`.

```bash
_docker_up() {
  local svc="${1:-}"
  if [ -z "$svc" ]; then
    svc=$(_fzf_pick "Démarrer" "${!DOCKER_SERVICES[@]}") || return
  fi

  local info="${DOCKER_SERVICES[$svc]:-}"
  [ -z "$info" ] && { _err "Service inconnu: $svc"; return 1; }

  local dir url
  IFS='|' read -r dir url _ <<< "$info"

  _info "Démarrage de ${BOLD}$svc${N}..."
  (cd "$dir" && docker compose up -d)
  _ok "$svc démarré → $url"
}
```

> **Documentation Docker Compose :** [docs.docker.com/compose/](https://docs.docker.com/compose/) — la commande `docker compose up -d` démarre les services en mode détaché.

---

## 6. Navigation de dossiers (le cas hub go)

`hub go bloko` doit changer le répertoire courant du shell parent. Impossible depuis un script enfant — le `cd` dans un subshell n'affecte pas le parent.

La solution : un **wrapper function zsh/bash** qui appelle le script et interprète sa sortie.

Dans le script `hub` :

```bash
cmd_go() {
  local dest="${1:-}"
  # ...
  local path="${QUICK_GOTO[$dest]:-$PROJECTS_DIR/$dest}"
  [ -d "$path" ] && echo "$path" || return 1
}
```

Dans `~/.zshrc` :

```zsh
function hub() {
  if [[ "$1" == "go" ]] || [[ "$1" == "cd" ]]; then
    local target
    target=$(command hub _resolve_go "${@:2}") && cd "$target" || command hub "$@"
  else
    command hub "$@"
  fi
}
```

Le script imprime le chemin sur stdout. La fonction zsh le capture et fait le `cd` elle-même.

> **Tip :** Ce pattern — script imprime, wrapper interprète — fonctionne pour tout ce qui nécessite de modifier l'environnement du shell parent (exports de variables, etc.).

---

## 7. Installation et mise à jour

Place le script dans `~/.local/bin/` — c'est dans le PATH par défaut sur la plupart des distributions modernes.

```bash
mkdir -p ~/.local/bin
cp hub ~/.local/bin/hub
chmod +x ~/.local/bin/hub
```

Pour s'assurer que `~/.local/bin` est dans le PATH :

```bash
# Dans ~/.zshrc ou ~/.bashrc
export PATH="$HOME/.local/bin:$PATH"
```

Pour mettre à jour le CLI depuis lui-même :

```bash
cmd_update() {
  case "${1:-all}" in
    all) bash "$SCRIPTS_DIR/update-all.sh" ;;
    apt) sudo apt update && sudo apt upgrade -y ;;
    npm) npm update -g ;;
    pip) pip3 list --outdated --format=freeze | cut -d= -f1 | xargs -r pip3 install --upgrade ;;
    *)   _err "Source inconnue: $1" ;;
  esac
}
```

---

## 8. Auto-documentation

Un CLI qui ne s'explique pas lui-même n'est pas utilisable après trois mois.

```bash
cmd_help() {
  cat << EOF
${BOLD}USAGE${N}
  hub [commande] [sous-commande] [args]

${BOLD}COMMANDES${N}
  ${C}hub${N}                  Dashboard système
  ${C}hub update${N} [source]  Mettre à jour (apt, flatpak, npm, pip...)
  ${C}hub docker${N} [action]  Gérer les containers Docker
  ${C}hub brain${N} [action]   Second cerveau (notes, projets, journal)
  ${C}hub go${N} [dest]        Naviguer vers un dossier
  ${C}hub sys${N} [action]     Maintenance système
  ${C}hub help${N}             Cette aide
EOF
}
```

> **Règle :** Chaque sous-commande a sa propre section dans le `cmd_help`. Si tu ajoutes une commande, tu ajoutes sa doc en même temps.

---

## 9. Tips et pièges courants

**Ne jamais `cd` dans une fonction sans subshell.** Un `cd /tmp` dans une fonction change le répertoire pour tout le script.

```bash
# ✗ Dangereux
_docker_up() {
  cd "$dir"
  docker compose up -d
}

# ✓ Correct — subshell isolé
_docker_up() {
  (cd "$dir" && docker compose up -d)
}
```

**Toujours `set -euo pipefail`.** `-e` stoppe sur erreur, `-u` stoppe sur variable non définie, `-o pipefail` propage les erreurs dans les pipes.

**Vérifier si une commande existe avant de l'appeler.**

```bash
if ! command -v fzf &>/dev/null; then
  _warn "fzf non installé — mode fallback activé"
fi
```

**Les `declare -A` ne sont pas exportables.** Les tableaux associatifs Bash ne passent pas aux sous-shells via `export`. Définis-les dans le script principal, pas dans des fichiers sourcés séparément.

---

## Structure finale recommandée

```
~/.local/bin/hub          # Script principal
~/Scripts/
├── update-all.sh         # Script de mise à jour (appelé par hub update)
├── brain-session.sh      # Hook Claude Code → note de session Brain
└── launchers/
    └── docker-app.sh     # Lanceur Docker → Chromium --app
```

Un seul fichier principal, des scripts spécialisés pour les opérations lourdes.

---

## Ressources

- [Bash Reference Manual](https://www.gnu.org/software/bash/manual/bash.html) — la référence complète
- [fzf](https://github.com/junegunn/fzf) — fuzzy finder, la pièce maîtresse des menus interactifs
- [Docker Compose CLI](https://docs.docker.com/compose/reference/) — toutes les sous-commandes `docker compose`
- [Pure Bash Bible](https://github.com/dylanaraps/pure-bash-bible) — recettes Bash sans dépendances externes

---

*→ [Le second cerveau que ce CLI pilote](./tutoriel-second-cerveau-obsidian.md)*
*→ [L'assistant IA construit par-dessus](./tutoriel-brain-assistant-rag.md)*
