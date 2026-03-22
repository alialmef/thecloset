# Contributing to Closet

Thanks for contributing! This guide will get you up and running.

## Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org/))
- **PostgreSQL** 15+ (local or Docker)
- **Expo CLI** (installed via npx, no global install needed)
- **iOS Simulator** (macOS only) or **Android Emulator** for mobile dev

## Getting Started

```bash
# 1. Clone the repo
git clone <repo-url> && cd thecloset

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your local PostgreSQL connection string and API keys

# 4. Set up the database
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run migrations
npm run db:seed        # Seed with test data

# 5. Start the API server
npm run dev:api

# 6. Start the mobile app (in a separate terminal)
npm run dev:mobile
```

Or if you're using Claude Code, just run `/setup`.

## Project Structure

This is a monorepo using npm workspaces:

- `apps/api` — Express + TypeScript backend
- `apps/mobile` — React Native (Expo) mobile app
- `packages/shared` — Shared types, constants, and validation schemas

## Branching & Workflow

1. **Create a branch** from `main`:
   - `feature/<short-description>` for new features
   - `fix/<short-description>` for bug fixes
   - `chore/<short-description>` for maintenance/tooling

2. **Make your changes** following the conventions in `CLAUDE.md`.

3. **Run checks before pushing**:
   ```bash
   npm run lint          # Lint check (must pass with 0 warnings)
   npm run format:check  # Format check
   npm run typecheck     # TypeScript check
   npm test              # Run all tests
   ```

4. **Push and open a PR** against `main`.

5. **CI will run automatically** — lint, format, types, tests, and build must all pass.

6. **Get a review** — PRs require at least 1 approval before merging.

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add borrow request approval flow
fix: handle null avatar in profile screen
chore: update prisma to v5.12
docs: add API authentication docs
test: add integration tests for item upload
refactor: extract outfit builder into composable hook
```

## Code Conventions

See `CLAUDE.md` for the full list. The key ones:

- **TypeScript strict mode** — no `any`, explicit return types on exports
- **Backend**: thin route handlers → service layer → Prisma
- **Mobile**: functional components, Zustand + React Query, StyleSheet.create
- **Testing**: cover error cases, not just happy paths
- **Validation**: Zod schemas at API boundaries

## Running Tests

```bash
# All tests
npm test

# API tests only
npm test --workspace=apps/api

# Mobile tests only
npm test --workspace=apps/mobile

# With coverage
npm test -- --coverage
```

## Database Changes

When you modify the Prisma schema:

```bash
# Create a migration
cd apps/api && npx prisma migrate dev --name <describe-the-change>

# Regenerate the client
npm run db:generate
```

Always commit the migration files along with your schema changes.

## Need Help?

- Read `CLAUDE.md` for code conventions and project context
- Read `docs/PRD.md` for product requirements and user stories
- Read `docs/ARCHITECTURE.md` for system architecture
