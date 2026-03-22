# Closet — The Social Wardrobe / La garde-robe sociale

[English](#english) · [Français](#français)

---

## English

A mobile-first app for friend groups to share, borrow, and style outfits from each other's wardrobes.

### Quick start

```bash
# Install dependencies
npm install

# Set up environment
cp apps/api/.env.example apps/api/.env
# Edit .env with your PostgreSQL connection string

# Set up database
npm run db:generate
npm run db:migrate
npm run db:seed

# Run the API
npm run dev:api

# Run the mobile app (separate terminal)
npm run dev:mobile
```

Using Claude Code? Run `/setup`.

### Project structure

```
thecloset/
├── apps/
│   ├── api/           # Express + TypeScript backend
│   └── mobile/        # React Native (Expo) mobile app
├── packages/
│   └── shared/        # Shared types, constants, validation
└── docs/              # PRD, architecture docs
```

### Tech stack

- **Mobile**: React Native (Expo) + TypeScript
- **Backend**: Express + TypeScript
- **Database**: PostgreSQL + Prisma
- **State**: Zustand + React Query
- **Validation**: Zod
- **CI**: GitHub Actions

### Documentation

- [`docs/PRD.md`](docs/PRD.md) — Product requirements
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — System architecture
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — How to contribute
- [`CLAUDE.md`](CLAUDE.md) — AI assistant context & code conventions

### Scripts

| Command | Description |
|---------|------------|
| `npm run dev:api` | Start API server (dev) |
| `npm run dev:mobile` | Start Expo mobile app |
| `npm test` | Run all tests |
| `npm run lint` | Lint all code |
| `npm run format` | Format all code |
| `npm run typecheck` | Type-check all code |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with test data |

---

## Français

Application mobile pour que des groupes d’amis partagent, empruntent et composent des tenues à partir des garde-robes des uns et des autres.

### Démarrage rapide

```bash
# Installer les dépendances
npm install

# Configurer l’environnement
cp apps/api/.env.example apps/api/.env
# Modifier .env avec votre chaîne de connexion PostgreSQL

# Configurer la base de données
npm run db:generate
npm run db:migrate
npm run db:seed

# Lancer l’API
npm run dev:api

# Lancer l’app mobile (terminal séparé)
npm run dev:mobile
```

Vous utilisez Claude Code ? Exécutez simplement `/setup`.

### Structure du projet

```
thecloset/
├── apps/
│   ├── api/           # Backend Express + TypeScript
│   └── mobile/        # Application mobile React Native (Expo)
├── packages/
│   └── shared/        # Types, constantes et validation partagés
└── docs/              # PRD, documentation d’architecture
```

### Pile technique

- **Mobile** : React Native (Expo) + TypeScript
- **Backend** : Express + TypeScript
- **Base de données** : PostgreSQL + Prisma
- **État** : Zustand + React Query
- **Validation** : Zod
- **CI** : GitHub Actions

### Documentation

- [`docs/PRD.md`](docs/PRD.md) — Cahier des charges produit
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Architecture système
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — Guide de contribution
- [`CLAUDE.md`](CLAUDE.md) — Contexte pour l’assistant IA et conventions de code

### Scripts

| Commande | Description |
|---------|------------|
| `npm run dev:api` | Démarrer le serveur API (dev) |
| `npm run dev:mobile` | Démarrer l’app mobile Expo |
| `npm test` | Lancer tous les tests |
| `npm run lint` | Linter tout le code |
| `npm run format` | Formater tout le code |
| `npm run typecheck` | Vérifier les types sur tout le code |
| `npm run db:migrate` | Exécuter les migrations de base de données |
| `npm run db:seed` | Remplir la base avec des données de test |
