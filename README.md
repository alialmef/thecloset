# Closet — The Social Wardrobe

A mobile-first app for friend groups to share, borrow, and style outfits from each other's wardrobes.

## Quick Start

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

Using Claude Code? Just run `/setup`.

## Project Structure

```
thecloset/
├── apps/
│   ├── api/           # Express + TypeScript backend
│   └── mobile/        # React Native (Expo) mobile app
├── packages/
│   └── shared/        # Shared types, constants, validation
└── docs/              # PRD, architecture docs
```

## Tech Stack

- **Mobile**: React Native (Expo) + TypeScript
- **Backend**: Express + TypeScript
- **Database**: PostgreSQL + Prisma
- **State**: Zustand + React Query
- **Validation**: Zod
- **CI**: GitHub Actions

## Documentation

- [`docs/PRD.md`](docs/PRD.md) — Product requirements
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — System architecture
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — How to contribute
- [`CLAUDE.md`](CLAUDE.md) — AI assistant context & code conventions

## Scripts

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
