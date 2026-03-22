# Architecture Overview — Closet

## System Diagram

```
                    ┌─────────────────┐
                    │   React Native  │
                    │   (Expo) App    │
                    │                 │
                    │  Zustand Store  │
                    │  React Query    │
                    └────────┬────────┘
                             │
                        HTTPS/REST
                             │
                    ┌────────▼────────┐
                    │   Express API   │
                    │   (Node.js)     │
                    │                 │
                    │  Routes → Svcs  │
                    │  Middleware      │
                    │  Zod Validation  │
                    └──┬──────┬───┬───┘
                       │      │   │
              ┌────────▼┐  ┌──▼─┐ │
              │PostgreSQL│  │ S3 │ │
              │ (Prisma) │  │CDN │ │
              └──────────┘  └────┘ │
                                   │
                     ┌─────────────▼──────────────┐
                     │      External Services      │
                     │                             │
                     │  Vision API (auto-tagging)  │
                     │  Uber Direct / DoorDash     │
                     │  Firebase Auth + FCM        │
                     │  WebSockets (Socket.io)     │
                     └─────────────────────────────┘
```

## Monorepo Structure

This is an npm workspaces monorepo with three packages:

| Package           | Purpose                                     | Dependencies               |
| ----------------- | ------------------------------------------- | -------------------------- |
| `packages/shared` | Types, constants, Zod validation schemas    | zod                        |
| `apps/api`        | Express backend, Prisma ORM, business logic | shared, prisma, express    |
| `apps/mobile`     | React Native (Expo) mobile app              | shared, react-native, expo |

`shared` is the dependency root — both `api` and `mobile` depend on it. There are no circular dependencies.

## Backend Architecture

### Request Lifecycle

```
Request → Middleware (auth, validation) → Route Handler → Service → Prisma → Response
```

1. **Middleware** runs first: `authenticate` attaches `req.user`, `validate` parses the body/query/params with Zod.
2. **Route handlers** are thin — they extract validated input, call a service function, and return the formatted response.
3. **Services** contain all business logic. They take explicit arguments, interact with Prisma, and throw typed errors (`NotFoundError`, `ForbiddenError`, etc.).
4. **Error handler** middleware catches thrown errors and returns the standard `{ error: { code, message } }` response shape.

### Key Directories

```
apps/api/src/
├── routes/          # Express routers — one file per resource
├── middleware/      # authenticate, validate, error-handler
├── services/        # Business logic — one file per domain
├── lib/             # Prisma client, custom error classes
└── utils/           # Helpers (date formatting, invite code generation, etc.)
```

### Database

PostgreSQL via Prisma ORM. Schema lives at `apps/api/prisma/schema.prisma`.

Key design decisions:

- **UUIDs** for all primary keys (no auto-increment integers exposed to clients)
- **snake_case** column names in the DB, **camelCase** in TypeScript (Prisma `@map` handles this)
- **Composite primary keys** for junction tables (`GroupMembership`, `OutfitItem`, `ItemGroupVisibility`)
- **Indexes** on frequently queried columns: `items.owner_id`, `items.category`, `items.status`, `borrow_requests.borrower_id`, `borrow_requests.owner_id`

## Mobile Architecture

### State Management

| Layer        | Tool                         | Purpose                                  |
| ------------ | ---------------------------- | ---------------------------------------- |
| Server state | React Query (TanStack Query) | API data fetching, caching, invalidation |
| Client state | Zustand                      | Auth state, UI state, draft outfits      |

### Navigation

Bottom tab navigator with 5 tabs matching the PRD information architecture:

| Tab      | Screen           | Purpose                         |
| -------- | ---------------- | ------------------------------- |
| Home     | `HomeScreen`     | Social feed                     |
| Closets  | `ClosetsScreen`  | Browse closets                  |
| Style    | `StyleScreen`    | Outfit builder                  |
| Activity | `ActivityScreen` | Borrow requests & notifications |
| Profile  | `ProfileScreen`  | User settings & stats           |

### API Communication

All API calls go through `src/services/api.ts` — a centralized client that handles auth headers, base URL, error parsing. Components never call `fetch` directly.

## Auth Flow (Planned)

```
Phone/SSO → Firebase Auth → JWT → API (verify JWT in middleware) → req.user
```

Currently stubbed with `x-user-id` header for local dev. Will be replaced with Firebase Auth JWT verification.

## Image Upload Flow (Planned)

```
Camera/Gallery → Compress → Presigned URL from API → Upload to S3 → Save URL to Item record
```

## AI Auto-Tagging Flow (Planned)

```
Image uploaded → API sends to Vision API → Returns: category, color, season, occasion, brand → Saved to Item
```

The AI layer is called from the item creation service. Results are saved as defaults that the user can override.
