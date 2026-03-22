# Closet — La garde-robe sociale

Application mobile pour que des groupes d’amis partagent, empruntent et composent des tenues à partir des garde-robes des uns et des autres.

## Démarrage rapide

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

## Structure du projet

```
thecloset/
├── apps/
│   ├── api/           # Backend Express + TypeScript
│   └── mobile/        # Application mobile React Native (Expo)
├── packages/
│   └── shared/        # Types, constantes et validation partagés
└── docs/              # PRD, documentation d’architecture
```

## Pile technique

- **Mobile** : React Native (Expo) + TypeScript
- **Backend** : Express + TypeScript
- **Base de données** : PostgreSQL + Prisma
- **État** : Zustand + React Query
- **Validation** : Zod
- **CI** : GitHub Actions

## Documentation

- [`docs/PRD.md`](docs/PRD.md) — Cahier des charges produit
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Architecture système
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — Guide de contribution
- [`CLAUDE.md`](CLAUDE.md) — Contexte pour l’assistant IA et conventions de code

## Scripts

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
