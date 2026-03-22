# Closet — The Social Wardrobe

## What This Is

Closet is a mobile-first app for friend groups to share, borrow, and style outfits from each other's wardrobes. Think of it as a group closet that lives on your phone. Private, trust-based, social.

**Read `docs/PRD.md` for the full product requirements document.**

## Tech Stack

| Layer         | Technology                                           |
| ------------- | ---------------------------------------------------- |
| Mobile        | React Native (Expo) + TypeScript                     |
| Backend       | Node.js / Express + TypeScript                       |
| Database      | PostgreSQL with Prisma ORM                           |
| Image Storage | AWS S3 / Cloudflare R2 with CDN                      |
| AI Services   | Vision API (GPT-4o / Claude Vision) for auto-tagging |
| Delivery      | Uber Direct API / DoorDash Drive API                 |
| Auth          | Phone OTP + Apple/Google SSO (via Firebase Auth)     |
| Notifications | Firebase Cloud Messaging (FCM) + APNs                |
| Real-time     | WebSockets (Socket.io)                               |

## Repo Structure

This is a monorepo using npm workspaces.

```
thecloset/
├── apps/
│   ├── mobile/                 # React Native (Expo) app
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── screens/        # Screen components (one per route)
│   │   │   ├── navigation/     # React Navigation config
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── services/       # API client, storage, etc.
│   │   │   ├── store/          # State management (Zustand)
│   │   │   ├── utils/          # Helper functions
│   │   │   └── assets/         # Images, fonts, etc.
│   │   ├── App.tsx             # Root component
│   │   ├── app.json
│   │   ├── package.json        # Deps, scripts, Jest config
│   │   └── tsconfig.json
│   │
│   └── api/                    # Express backend
│       ├── src/
│       │   ├── routes/         # Express route handlers (one file per resource)
│       │   ├── middleware/     # Auth, validation, error handling
│       │   ├── services/       # Business logic layer
│       │   ├── lib/            # Database client, custom error classes
│       │   ├── utils/          # Helper functions
│       │   └── index.ts        # App entry point
│       ├── prisma/
│       │   ├── schema.prisma   # Database schema (source of truth)
│       │   └── seed.ts         # Seed data for local dev
│       ├── tests/
│       │   └── integration/    # Integration tests (Supertest)
│       ├── package.json        # Deps, scripts, Jest config
│       └── tsconfig.json
│
├── packages/
│   └── shared/                 # Shared types, constants, validation
│       ├── src/
│       │   ├── types/          # TypeScript type definitions
│       │   ├── constants/      # Shared constants (enums, config values)
│       │   └── validation/     # Zod schemas for shared validation
│       ├── package.json
│       └── tsconfig.json
│
├── docs/                       # Documentation
│   ├── PRD.md                  # Product requirements document
│   └── ARCHITECTURE.md         # System architecture overview
│
├── .claude/                    # Claude Code configuration
│   ├── settings.json           # Shared team settings (committed)
│   └── commands/               # Custom slash commands
│
├── .github/                    # CI/CD (GitHub Actions)
│   ├── workflows/ci.yml        # Lint → format → types → test → build
│   └── pull_request_template.md
│
├── CLAUDE.md                   # This file — Claude Code project instructions
├── CONTRIBUTING.md             # Contributor guide
├── .gitignore
├── package.json                # Root: workspaces, scripts, prettier, eslint
└── tsconfig.base.json          # Shared TypeScript strict config
```

**Note on config location:** Prettier and ESLint configs live inside the root `package.json` (under `"prettier"` and `"eslintConfig"` keys) to keep the root directory clean. Jest configs live inside each workspace's `package.json` (under `"jest"` key).

**Note on unit tests:** Unit tests are co-located with source files as `*.test.ts` — there is no separate `tests/unit/` directory. Only integration tests get their own directory at `tests/integration/`.

## Code Conventions

### TypeScript

- **Strict mode everywhere.** `strict: true` in all tsconfig files. No `any` types unless absolutely unavoidable and commented with `// eslint-disable-next-line @typescript-eslint/no-explicit-any` plus a justification.
- **Use `interface` for object shapes, `type` for unions/intersections/utility types.**
- **Prefer `const` over `let`. Never use `var`.**
- **Use explicit return types on exported functions.**
- **Use Zod for runtime validation** at API boundaries (request bodies, query params, external API responses). Shared Zod schemas live in `packages/shared/src/validation/`.

### Naming

- **Files**: `kebab-case.ts` (e.g., `borrow-request.ts`, `closet-group.ts`)
- **Components (React Native)**: `PascalCase.tsx` (e.g., `OutfitCard.tsx`, `BorrowButton.tsx`)
- **Variables/functions**: `camelCase`
- **Types/interfaces**: `PascalCase`
- **Constants**: `SCREAMING_SNAKE_CASE`
- **Database tables/columns**: `snake_case` (Prisma maps to camelCase in code)
- **API routes**: `/api/v1/kebab-case` (e.g., `/api/v1/borrow-requests`)

### Backend (Express)

- **Route files** export an Express Router. One file per resource in `apps/api/src/routes/`.
- **Business logic lives in services**, not route handlers. Route handlers validate input, call a service, and format the response.
- **Service functions are pure where possible** — take explicit arguments, return values, throw typed errors.
- **Error handling**: Use a centralized error handler middleware. Throw custom error classes (e.g., `NotFoundError`, `UnauthorizedError`, `ValidationError`) that extend a base `AppError` class.
- **Response shape** is always:
  ```json
  { "data": <payload> }              // success
  { "error": { "code": "...", "message": "..." } }  // error
  ```
- **Auth middleware** attaches `req.user` with the authenticated user's ID and basic info. All protected routes use this middleware.
- **Database access**: Always go through Prisma client via `apps/api/src/lib/prisma.ts`. Never write raw SQL unless Prisma cannot express the query.

### Mobile (React Native / Expo)

- **Functional components only.** No class components.
- **State management**: Zustand for global state. React Query (TanStack Query) for server state / API caching.
- **Navigation**: React Navigation with a bottom tab navigator matching the 5 tabs (Home, Closets, Style, Activity, Profile).
- **Component structure**: Each component in its own file. Co-locate styles with components using StyleSheet.create.
- **Screens** are in `src/screens/` and map 1:1 to navigation routes.
- **API calls** go through a centralized API client in `src/services/api.ts` — never call `fetch` directly from components.

### Testing

- **Backend**: Jest for unit tests, Supertest for integration tests.
- **Mobile**: Jest + React Native Testing Library.
- **Test file location**: Co-located `*.test.ts` files for unit tests. Integration tests in `apps/api/tests/integration/`.
- **Write non-happy-path tests.** Test error cases, edge cases, invalid input, auth failures, race conditions. Happy path alone is not sufficient.
- **Every new API route must have at least**: one success test, one auth failure test, one validation error test.
- **Run tests before finishing any task**: `npm test` from the root.

### Git & PRs

- **Branch naming**: `feature/<short-description>`, `fix/<short-description>`, `chore/<short-description>`
- **Commit messages**: Use conventional commits — `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`
- **PRs**: One feature/fix per PR. Include a summary of what and why. Reference the relevant user story (e.g., `US-5`) if applicable.
- **Always run the `/review` command before considering work complete.**

## Data Model Reference

These are the core entities. See `apps/api/prisma/schema.prisma` for the source of truth.

- **User**: id, name, phone, avatarUrl, createdAt
- **Group**: id, name, inviteCode, createdBy, maxMembers (default 20), createdAt
- **GroupMembership**: userId, groupId, role (ADMIN | MEMBER), joinedAt
- **Item**: id, ownerId, imageUrl, category, color, brand, season, occasion, status (AVAILABLE | LENT | UNAVAILABLE), visibility (ALL_GROUPS | SPECIFIC_GROUPS | PRIVATE), createdAt
- **Outfit**: id, createdBy, styledFor (userId), items[] (array of itemIds, can span multiple owners), note, createdAt
- **BorrowRequest**: id, itemId, borrowerId, ownerId, status (PENDING | APPROVED | DECLINED | ACTIVE | RETURNED), pickupMethod (IN_PERSON | DELIVERY), borrowDurationDays, requestedAt, approvedAt, returnedAt
- **Delivery**: id, borrowRequestId, provider (UBER | DOORDASH), trackingUrl, status, feeCents, createdAt

## Do's

- Follow the existing patterns in sibling files before creating something new.
- Use the shared types from `packages/shared` — don't re-declare types that already exist.
- Validate all external input (API requests, webhook payloads) with Zod.
- Handle errors explicitly — no swallowed catches.
- Write tests for the code you add.
- Keep API route handlers thin — delegate to services.
- Use Prisma's type-safe client — don't fight it with raw queries.
- Run `/review` before finishing any task.

## Don'ts

- Don't use `any`. If you need a type escape hatch, use `unknown` and narrow.
- Don't put business logic in route handlers or React components. It goes in services (backend) or hooks/stores (mobile).
- Don't install new dependencies without justification. Check if what you need is already available.
- Don't commit `.env` files, credentials, API keys, or secrets.
- Don't write tests that only cover the happy path.
- Don't skip error handling. Every `try/catch` should either re-throw, log, or return a meaningful error.
- Don't create barrel `index.ts` files that re-export everything — import directly from the source file. Exception: `packages/shared/src/index.ts` is the package entry point and re-exports are expected there.
- Don't use inline styles in React Native — use `StyleSheet.create`.

## Common Commands

```bash
# Install all dependencies (from root)
npm install

# Run the API server (dev mode)
npm run dev --workspace=apps/api

# Run the mobile app
npm run start --workspace=apps/mobile

# Run all tests
npm test

# Run API tests only
npm test --workspace=apps/api

# Run mobile tests only
npm test --workspace=apps/mobile

# Generate Prisma client after schema changes
npm run db:generate --workspace=apps/api

# Run database migrations
npm run db:migrate --workspace=apps/api

# Seed the database
npm run db:seed --workspace=apps/api

# Lint everything
npm run lint

# Format everything
npm run format
```
