# IssueMentor

IssueMentor aide les développeurs débutants à contribuer à des projets open source. Il suffit de coller l’URL d’une issue GitHub pour obtenir une analyse générée par Gemini : résumé, difficulté, compétences requises, étapes de contribution, fichiers à examiner et brouillon de Pull Request.

Les analyses sont enregistrées localement afin qu’une issue déjà traitée soit réutilisée sans nouvel appel à l’IA. L’interface permet ensuite de suivre l’avancement de chaque contribution.

## Fonctionnalités

- Récupération d’une issue publique depuis GitHub.
- Analyse en français avec Google Gemini.
- Mise en cache des analyses dans une base SQLite.
- Affichage des compétences, étapes et fichiers à vérifier.
- Génération d’un titre et d’une description de Pull Request, copiables en un clic.
- Suivi par statut : **À faire**, **En cours** ou **PR envoyée**.
- Filtrage, suppression et rechargement des issues enregistrées.

## Architecture

Le projet est organisé en deux applications indépendantes :

```text
.
├── api/   # API Express, intégration GitHub/Gemini et persistance Prisma
└── web/   # Interface React + Vite
```

### API

- **Express 5** et **TypeScript**
- **Prisma** avec **SQLite**
- **Zod** pour valider les entrées et les réponses de l’IA
- **Google GenAI** pour l’analyse

L’API écoute par défaut sur `http://localhost:3001`.

### Interface web

- **React 19** et **TypeScript**
- **Vite**
- **Tailwind CSS**
- Composants UI basés sur Base UI et Lucide

Le serveur de développement Vite écoute par défaut sur `http://localhost:5173` et redirige `/api` vers l’API sur le port 3001.

## Prérequis

- Node.js récent
- pnpm `12.15.0` (version indiquée par le projet)
- Une clé API Google Gemini

## Installation

Depuis la racine du dépôt :

```bash
cd api
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
```

Puis installez les dépendances du frontend :

```bash
cd ../web
pnpm install
```

La migration crée la base SQLite dans `api/prisma/dev.db`.

## Configuration

Créez le fichier `api/.env` :

```env
GEMINI_API_KEY=votre_cle_api_gemini
AI_MODEL=gemma-3-27b-it
PORT=3001
```

`GEMINI_API_KEY` et `AI_MODEL` sont obligatoires pour lancer une analyse. `PORT` est facultatif et vaut `3001` par défaut. Ne committez jamais le fichier `.env`.

## Lancement en développement

Ouvrez deux terminaux.

Terminal 1 — API :

```bash
cd api
pnpm dev
```

Terminal 2 — interface :

```bash
cd web
pnpm dev
```

Ouvrez ensuite [http://localhost:5173](http://localhost:5173).

Pour vérifier que l’API répond :

```text
GET http://localhost:3001/api/health
```

Réponse attendue :

```json
{ "status": "ok" }
```

## API

| Méthode | Route | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Vérifie que l’API est disponible |
| `POST` | `/api/analyze` | Analyse ou retourne l’analyse en cache d’une issue |
| `GET` | `/api/issues` | Liste les issues enregistrées |
| `PATCH` | `/api/issues/:id/status` | Modifie le statut d’une issue |
| `DELETE` | `/api/issues/:id` | Supprime une issue |

Exemple de requête d’analyse :

```bash
curl -X POST http://localhost:3001/api/analyze ^
  -H "Content-Type: application/json" ^
  -d "{\"issueUrl\":\"https://github.com/owner/repository/issues/123\"}"
```

L’URL doit correspondre à une issue GitHub au format `https://github.com/<proprietaire>/<depot>/issues/<numero>`.

## Scripts disponibles

### `api`

```bash
pnpm dev                 # Lance l’API avec rechargement automatique
pnpm prisma generate     # Génère le client Prisma
pnpm prisma migrate dev  # Applique les migrations en développement
```

### `web`

```bash
pnpm dev       # Lance Vite en mode développement
pnpm build     # Vérifie TypeScript et construit l’application
pnpm lint      # Lance Oxlint
pnpm preview   # Sert le build localement
```

## Flux d’une analyse

1. L’utilisateur saisit une URL d’issue dans l’interface.
2. L’API valide et normalise l’URL.
3. Si l’issue existe déjà en base, l’analyse enregistrée est retournée.
4. Sinon, l’API récupère le titre, le corps et les labels via l’API GitHub.
5. Gemini produit une analyse JSON validée par Zod.
6. L’analyse est sauvegardée dans SQLite puis affichée dans l’interface.

## Limites actuelles

- Seules les issues GitHub accessibles publiquement sont prises en charge.
- L’authentification GitHub n’est pas configurée ; les limites de l’API GitHub peuvent donc s’appliquer.
- La base de données est locale au processus de développement et n’est pas prévue pour un déploiement multi-instance.
- Aucun jeu de tests automatisés n’est encore configuré.