# GNOME Tauri TODO

GNOME Tauri TODO is a Linux-first desktop task manager built with Tauri v2,
React, TypeScript, Tailwind CSS, Prisma, and PostgreSQL. It is currently a
single-user app focused on projects, tasks, smart views, local search,
preferences, and Linux desktop packaging.

## Stack

- Desktop shell: Tauri v2
- Frontend: React, TypeScript, Vite
- Styling: Tailwind CSS, shadcn-style Radix dialogs, lucide-react icons
- State: Zustand
- Database: PostgreSQL
- ORM: Prisma
- Local services: Docker Compose
- Packaging: Tauri Linux bundles for AppImage, `.deb`, and `.rpm`

## Prerequisites

- Node.js and npm through nvm
- Rust toolchain
- Docker and Docker Compose
- Linux desktop build dependencies for Tauri when creating bundles

Non-interactive shells may not load nvm automatically. Source it before Node
commands when needed:

```bash
source ~/.nvm/nvm.sh
```

## Setup

Install dependencies:

```bash
source ~/.nvm/nvm.sh
npm install
```

Create a local `.env` with the database URL:

```env
DATABASE_URL="postgresql://todo_user:todo_password@localhost:5432/todo_app"
```

Start PostgreSQL and Adminer:

```bash
npm run db:start
```

Apply Prisma migrations:

```bash
npx prisma migrate dev
```

Start the Tauri development app:

```bash
npm run dev
```

For frontend-only development:

```bash
npm run vite:dev
```

The Vite dev server runs at `http://127.0.0.1:1420/`.

## Scripts

```bash
npm run dev          # Start the Tauri development app
npm run build        # Build frontend and Tauri Linux bundles
npm run vite:build   # Typecheck and build the frontend only
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript without emitting files
npm test             # Run Node-based frontend tests
npm run db:start     # Start PostgreSQL and Adminer
npm run db:stop      # Stop repository database services
npm run db:reset     # Reset the repository database volume
```

## Database

Docker Compose starts:

- PostgreSQL on `localhost:5432`
- Adminer on `http://localhost:8080`

Default credentials:

- Database: `todo_app`
- User: `todo_user`
- Password: `todo_password`

Avoid broad Docker teardown commands in this repository. Do not use
`docker compose down` or `docker compose down -v`; use the service-scoped npm
scripts or explicit `docker compose stop postgres adminer` commands so unrelated
local services are not affected.

## Prisma

Generate the Prisma client after schema changes:

```bash
npx prisma generate
```

Create and apply a migration:

```bash
npx prisma migrate dev --name <migration_name>
```

Inspect the database with Prisma Studio:

```bash
npx prisma studio
```

## Schema Notes

`Project` groups tasks. It stores a name, optional description and color,
archive state, and timestamps. Deleting a project cascades to its tasks.

`Task` belongs to one project. It stores title, optional description, status,
priority, optional due/completion dates, sort order, and timestamps. Indexed
fields support project ordering, smart views, and completed groupings.

`AppSetting` stores single-user app preferences as JSON by key. The current
frontend preferences also use local storage until the UI is wired to persisted
Tauri settings commands.

## Testing

Frontend tests use Node's built-in test runner. The local runner bundles
TypeScript test files with esbuild into `.test-output/`.

```bash
npm test
```

Current coverage includes task smart-view filtering, local search, and task-list
rendering.

## Packaging

Build Linux bundles:

```bash
source ~/.nvm/nvm.sh
npm run build
```

Configured targets:

- AppImage
- `.deb`
- `.rpm`

Bundle outputs are written under:

```text
src-tauri/target/release/bundle/
```

To validate the Tauri app without creating bundles:

```bash
npx tauri build --no-bundle
```

## Project Layout

```text
src/
  components/        Shared UI primitives
  features/          Feature modules for projects, tasks, settings
  layouts/           App shell and navigation
  lib/               Shared utilities and Prisma client wrapper
  pages/             Route-level screens
  stores/            Zustand stores
src-tauri/           Tauri v2 Rust application and desktop config
prisma/              Prisma schema and migrations
docker/              Local service scripts and database notes
scripts/             Test and development helpers
```
