---
title: "Construire un assistant IA personnel avec RAG — connecter son vault Obsidian à un LLM"
format: tutoriel
status: published
tags: [ia, rag, llm, chromadb, python, fastapi, obsidian, groq, ollama, embeddings]
date: 2026-04-30
created: 2026-04-30
updated: 2026-04-30
related:
  - tutoriel-second-cerveau-obsidian
  - tutoriel-hub-cli-workstation
---

# Construire un assistant IA personnel avec RAG — connecter son vault Obsidian à un LLM

Les assistants IA généralistes ne connaissent pas ton contexte. Ils ne savent pas que tu construis un SaaS de paiement pour le marché africain, que tu préfères Convex à Supabase pour tel usage, ou que tu as déjà résolu ce bug particulier le mois dernier.

RAG — Retrieval-Augmented Generation — est la solution. Avant de répondre, l'assistant cherche dans ta base de connaissance et injecte les passages pertinents dans sa réponse. Il parle avec ta mémoire.

Ce tutoriel détaille comment j'ai construit `hub ai` — un assistant IA connecté à mon vault Obsidian, tournant localement, avec des personas spécialisés et un routing intelligent vers différents LLM selon la tâche.

> **Prérequis :** Python 3.10+, Docker, un vault Obsidian, clé API Groq (gratuite).
> **Code source :** `~/.local/share/ai-assistant/` — indexer Python + proxy FastAPI + Open WebUI.

---

## Architecture d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                        Open WebUI                           │
│            (interface chat dans le navigateur)              │
└─────────────────────┬───────────────────────────────────────┘
                      │ POST /v1/chat/completions
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Proxy FastAPI :11435                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  1. Embed la query (sentence-transformers)          │    │
│  │  2. Cherche dans ChromaDB (top-5 chunks)            │    │
│  │  3. Construit le contexte RAG                       │    │
│  │  4. Route vers le bon LLM selon le persona          │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────┬───────────────────────────┬──────────────────────┘
           │                           │
           ▼                           ▼
┌──────────────────┐       ┌──────────────────────────┐
│   Groq API       │       │   Ollama (local)          │
│  llama-3.3-70b   │       │   mistral:7b              │
│  deepseek-r1-70b │       │   (fallback hors-ligne)   │
└──────────────────┘       └──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│                    ChromaDB                                  │
│         2 045 chunks indexés depuis ~/Brain/                │
└─────────────────────────────────────────────────────────────┘
```

Trois composants : un **indexer** qui lit le vault, une **base vectorielle** qui stocke les chunks, un **proxy** qui orchestre le tout.

---

## 1. Concepts fondamentaux

### Embeddings — transformer du texte en vecteurs

Un embedding est une représentation numérique d'un texte. Deux textes sémantiquement proches ont des vecteurs proches dans l'espace mathématique.

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

v1 = model.encode("Comment indexer un vault Obsidian ?")
v2 = model.encode("How to index an Obsidian vault?")
# v1 et v2 sont proches malgré les langues différentes
```

Le modèle `paraphrase-multilingual-MiniLM-L12-v2` supporte 50+ langues dans le même espace vectoriel. Un vault en français est interrogeable en anglais sans traduction.

> **Documentation :** [sbert.net](https://www.sbert.net/docs/sentence_transformer/pretrained_models.html) — liste complète des modèles sentence-transformers avec leurs benchmarks.

### RAG — chercher avant de générer

RAG (Retrieval-Augmented Generation) est un pattern en deux temps :

1. **Retrieval** — encoder la question en vecteur, chercher les K passages les plus similaires dans la base
2. **Generation** — injecter ces passages dans le prompt système, envoyer au LLM

```
[Question utilisateur]
    ↓ embed
[Vecteur de la question] → ChromaDB → [5 passages pertinents]
    ↓ concat
[Prompt : "Voici du contexte : {passages}. Question : {question}"]
    ↓ LLM
[Réponse ancrée dans le vault]
```

Sans RAG, le LLM invente. Avec RAG, il cite.

> **Papier fondateur :** [RAG for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401) (Lewis et al., 2020) — l'article qui a formalisé le concept.

### ChromaDB — base de données vectorielle locale

ChromaDB est une base vectorielle open source qui tourne entièrement en local, sans serveur externe.

```python
import chromadb

client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection(
    name="brain",
    metadata={"hnsw:space": "cosine"}  # similarité cosinus
)

# Indexer
collection.add(
    documents=["texte du chunk"],
    embeddings=[[0.1, 0.3, ...]],
    metadatas=[{"source": "notes/20260430.md", "type": "note"}],
    ids=["chunk-001"]
)

# Chercher
results = collection.query(
    query_embeddings=[vecteur_question],
    n_results=5
)
```

> **Documentation ChromaDB :** [docs.trychroma.com](https://docs.trychroma.com) — getting started, filtres de métadonnées, configuration HNSW.

---

## 2. L'indexer — lire et chunker le vault

L'indexer lit tous les fichiers `.md` du vault, les découpe en chunks, les encode, et les stocke dans ChromaDB.

```python
# brain_indexer.py
import os
import re
from pathlib import Path
from sentence_transformers import SentenceTransformer
import chromadb

BRAIN_DIR = Path.home() / "Brain"
CHROMA_PATH = Path.home() / ".local/share/ai-assistant/chroma_db"
EMBED_MODEL = "paraphrase-multilingual-MiniLM-L12-v2"
CHUNK_SIZE = 400
CHUNK_OVERLAP = 80

model = SentenceTransformer(EMBED_MODEL)
client = chromadb.PersistentClient(path=str(CHROMA_PATH))
collection = client.get_or_create_collection("brain", metadata={"hnsw:space": "cosine"})
```

**Chunking par paragraphes :**

```python
def chunk_text(text: str, size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    paragraphs = re.split(r'\n{2,}', text.strip())
    chunks, current = [], ""
    for para in paragraphs:
        if len(current) + len(para) < size:
            current += "\n\n" + para if current else para
        else:
            if current:
                chunks.append(current.strip())
            current = para
    if current:
        chunks.append(current.strip())
    return [c for c in chunks if len(c) > 50]
```

Pourquoi des chunks plutôt que des fichiers entiers ? Les LLM ont une fenêtre de contexte limitée. Chercher dans des chunks de 400 tokens donne une meilleure précision que d'injecter un fichier entier de 5 000 mots.

**Extraction des métadonnées YAML :**

```python
import yaml

def parse_frontmatter(content: str) -> tuple[dict, str]:
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            try:
                meta = yaml.safe_load(parts[1]) or {}
                return meta, parts[2].strip()
            except yaml.YAMLError:
                pass
    return {}, content
```

Les métadonnées (type, tags, title) permettent de filtrer les recherches — par exemple, chercher uniquement dans les notes de type `projet`.

**Indexation complète :**

```bash
# Première indexation
python indexer/brain_indexer.py --full

# Mise à jour incrémentale (fichiers modifiés depuis la dernière run)
python indexer/brain_indexer.py
```

> **Tip :** Lance l'indexation via `cron` ou un hook Git post-commit dans `~/Brain/` pour maintenir l'index à jour automatiquement.

---

## 3. Le proxy FastAPI — l'orchestrateur

Le proxy expose une API compatible OpenAI. Open WebUI (ou n'importe quel client OpenAI) le voit comme un LLM ordinaire, sans savoir qu'il y a un RAG derrière.

```python
# main.py
from fastapi import FastAPI
from openai import AsyncOpenAI
import chromadb
from sentence_transformers import SentenceTransformer

app = FastAPI()
EMBED_MODEL = "paraphrase-multilingual-MiniLM-L12-v2"
embed_model = SentenceTransformer(EMBED_MODEL)

chroma = chromadb.PersistentClient(path=str(CHROMA_PATH))
collection = chroma.get_collection("brain")

groq_client = AsyncOpenAI(
    api_key=os.environ["GROQ_API_KEY"],
    base_url="https://api.groq.com/openai/v1"
)
```

**Retrieval — chercher les passages pertinents :**

```python
def retrieve_context(query: str, n: int = 5) -> str:
    query_vec = embed_model.encode(query).tolist()
    results = collection.query(query_embeddings=[query_vec], n_results=n)

    if not results["documents"] or not results["documents"][0]:
        return ""

    chunks = []
    for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
        source = meta.get("source", "")
        chunks.append(f"[{source}]\n{doc}")

    return "\n\n---\n\n".join(chunks)
```

**Injection dans le prompt système :**

```python
RAG_SYSTEM_PROMPT = """Tu es un assistant personnel connecté au vault Brain de François Aboudou.

Voici des extraits pertinents de la base de connaissance :

{context}

---

Réponds en te basant sur ces extraits quand c'est possible.
Si les extraits ne sont pas pertinents, dis-le clairement."""
```

---

## 4. Les personas — agents spécialisés

Au lieu d'un seul assistant généraliste, le proxy expose plusieurs **personas** comme des modèles distincts. Open WebUI les liste dans le sélecteur de modèle.

```python
PERSONAS = {
    "brain-assistant": {
        "model": "llama-3.3-70b-versatile",  # via Groq
        "system": "Assistant personnel polyvalent connecté au vault Brain...",
        "use_rag": True,
    },
    "brain-code": {
        "model": "llama-3.1-70b-versatile",
        "system": "Expert en développement. Fournis du code précis, typé, avec des explications concises...",
        "use_rag": True,
    },
    "brain-think": {
        "model": "deepseek-r1-distill-llama-70b",  # raisonnement chaîné
        "system": "Mode raisonnement approfondi. Analyse les problèmes complexes étape par étape...",
        "use_rag": True,
    },
    "brain-writer": {
        "model": "llama-3.3-70b-versatile",
        "system": "Spécialiste rédaction : articles, devlogs, contenu LinkedIn/Facebook pour dev africain...",
        "use_rag": True,
    },
    "brain-fast": {
        "model": "mistral:7b",  # via Ollama local
        "system": "Mode rapide. Réponses courtes et directes.",
        "use_rag": False,
    },
}
```

**Routing par intention** — si l'utilisateur utilise `brain-assistant` (le persona par défaut), le proxy détecte automatiquement l'intention :

```python
INTENT_ROUTES = [
    (["code", "fonction", "bug", "erreur", "typescript", "python"], "brain-code"),
    (["pourquoi", "analyse", "stratégie", "compare", "décide"], "brain-think"),
    (["écris", "rédige", "article", "linkedin", "post"], "brain-writer"),
]

def _route_by_intent(query: str) -> str:
    lower = query.lower()
    for keywords, persona in INTENT_ROUTES:
        if any(kw in lower for kw in keywords):
            return persona
    return "brain-assistant"
```

Le routing est transparent — l'utilisateur reste dans `brain-assistant`, le bon modèle est appelé automatiquement.

> **Groq** offre des inférences ultra-rapides sur Llama et Mixtral via API. [console.groq.com](https://console.groq.com) — plan gratuit généreux pour usage personnel.

---

## 5. Groq vs Ollama — quelle stratégie

| | Groq | Ollama |
|---|---|---|
| Modèles | Llama-3.3-70b, DeepSeek-R1, Mixtral | Mistral, Llama, Gemma... |
| Vitesse | ~300 tokens/s | ~20-40 tokens/s (GPU local) |
| Coût | Gratuit jusqu'à 14k req/jour | 0€ (local) |
| Hors-ligne | Non | Oui |
| Confidentialité | Données envoyées à Groq | 100% local |

**Ma stratégie :** Groq pour les tâches importantes (code, raisonnement, rédaction), Ollama pour les questions rapides et les tests hors-ligne.

```bash
# Installer Ollama
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull mistral:7b

# Vérifier
ollama list
```

> **Documentation Ollama :** [ollama.ai/docs](https://ollama.ai/docs) — liste des modèles disponibles et configuration GPU.

---

## 6. Open WebUI — l'interface

[Open WebUI](https://github.com/open-webui/open-webui) est une interface chat open source compatible avec l'API OpenAI. Il tourne dans Docker et se connecte au proxy.

```yaml
# docker-compose.yml
services:
  proxy:
    build: ./proxy
    ports: ["11435:11435"]
    environment:
      - GROQ_API_KEY=${GROQ_API_KEY}
    volumes:
      - ${HOME}/.local/share/ai-assistant/chroma_db:/app/chroma_db:ro

  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    ports: ["3001:8080"]
    environment:
      - OPENAI_API_BASE_URL=http://proxy:11435/v1
      - OPENAI_API_KEY=brain-local
    depends_on: [proxy]
    volumes:
      - open-webui-data:/app/backend/data
```

Accès : `http://localhost:3001` — interface ChatGPT-like avec sélecteur de modèles (personas).

```bash
# Démarrage
hub ai start
# ou directement
cd ~/.local/share/ai-assistant && docker compose up -d
```

---

## 7. Déploiement et mise à jour

**Structure de fichiers :**

```
~/.local/share/ai-assistant/
├── docker-compose.yml
├── proxy/
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
└── indexer/
    ├── brain_indexer.py
    ├── requirements.txt
    └── venv/
```

**Commandes hub ai :**

```bash
hub ai start    # docker compose up -d
hub ai stop     # docker compose down
hub ai update   # réindexer le vault
hub ai status   # état des containers + stats index
hub ai logs     # logs du proxy
```

**Réindexation après ajout de notes :**

```bash
hub ai update
# → python indexer/venv/bin/python indexer/brain_indexer.py
# → 2045 chunks indexés en ~40 secondes
```

---

## 8. Questions pour tester le RAG

Ces questions vérifient que le retrieval fonctionne correctement :

```
# Test retrieval
"Quels projets sont actuellement actifs dans mon vault ?"
"Qu'est-ce que j'ai noté sur Moneroo ?"

# Test personas
"[brain-code] Écris une fonction TypeScript pour valider un numéro de téléphone africain"
"[brain-think] Compare Convex et Supabase pour un SaaS de paiement"

# Test langue
"What projects am I working on?" (réponse en français, retrieval multilingue)

# Test limites
"Qui a gagné la coupe du monde 2022 ?"
# → doit dire "je n'ai pas cette info dans le vault"
```

---

## 9. Tips et pièges courants

**Le chunk size impacte la qualité.** Trop petit (< 150 tokens) → perte de contexte. Trop grand (> 600 tokens) → bruit. 400 tokens avec 80 de chevauchement est un bon point de départ.

**Changer le modèle d'embedding nécessite une réindexation complète.** Les vecteurs de `all-MiniLM-L6-v2` et `paraphrase-multilingual-MiniLM-L12-v2` ne sont pas comparables.

**`set -euo pipefail` dans les scripts de démarrage.** Si ChromaDB n'est pas prêt, le proxy doit échouer proprement, pas se lancer en silencieux.

**Logs structurés dans le proxy.**

```python
import logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s"
)
logger = logging.getLogger(__name__)

# Dans la route chat
logger.info(f"query={query[:60]!r} persona={persona} chunks={len(context)}")
```

**Ne pas committer `chroma_db/` dans Git.** C'est un répertoire binaire qui change à chaque indexation — lourd et inutile en version control.

```bash
echo "chroma_db/" >> ~/.local/share/ai-assistant/.gitignore
```

---

## Architecture complète — recap

```
Hub CLI (hub ai)
    ↓
Docker Compose
    ├── Open WebUI :3001  ← interface navigateur
    └── Proxy FastAPI :11435
            ├── Embed (sentence-transformers multilingual)
            ├── Retrieve (ChromaDB cosine similarity)
            ├── Route (persona + intent detection)
            └── Generate
                    ├── Groq API (llama, deepseek — rapide, cloud)
                    └── Ollama (mistral — local, hors-ligne)

Indexer (Python)
    ← ~/Brain/**/*.md
    → 2 045 chunks dans ChromaDB
```

---

## Ressources

- [SBERT — Sentence Transformers](https://www.sbert.net) — modèles d'embeddings, benchmarks, documentation
- [ChromaDB](https://docs.trychroma.com) — base vectorielle locale, getting started
- [Groq Console](https://console.groq.com) — API ultra-rapide, modèles disponibles
- [Ollama](https://ollama.ai/docs) — LLM locaux, liste des modèles
- [Open WebUI](https://github.com/open-webui/open-webui) — interface chat open source
- [FastAPI](https://fastapi.tiangolo.com) — framework Python async pour APIs
- [RAG Survey (arxiv)](https://arxiv.org/abs/2312.10997) — état de l'art des architectures RAG

---

*→ [Le vault Obsidian que cet assistant interroge](./tutoriel-second-cerveau-obsidian.md)*
*→ [Le CLI qui orchestre tout ça depuis le terminal](./tutoriel-hub-cli-workstation.md)*
