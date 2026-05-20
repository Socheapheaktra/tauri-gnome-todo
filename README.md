# GNOME Tauri TODO

GNOME Tauri TODO is a Linux-first desktop task manager built with Tauri v2,
React, TypeScript, Tailwind CSS, Zustand, and SQLite. It is a single-user app
focused on projects, tasks, smart views, local search, preferences, and Linux
desktop packaging.

## Stack

- Desktop shell: Tauri v2
- Frontend: React, TypeScript, Vite
- Styling: Tailwind CSS, shadcn-style Radix dialogs, lucide-react icons
- State: Zustand UI/cache state hydrated from Tauri commands
- Database: SQLite, stored in the app data directory
- Packaging: Tauri Linux bundles

## Prerequisites

- Node.js and npm through nvm
- Rust toolchain
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

Start the Tauri development app:

```bash
npm run dev
```

For frontend-only development:

```bash
npm run vite:dev
```

The Vite dev server runs at `http://127.0.0.1:1420/`.

## Database

The app creates and migrates a SQLite database automatically on startup. The
database file is named `tasks.sqlite3` and is stored in the platform app data
directory for the Tauri identifier `dev.yeeahnis.gnome-tauri-todo`.

No PostgreSQL, Docker Compose service, `.env` database URL, Prisma generation,
or manual migration command is required.

## Scripts

```bash
npm run dev          # Start the Tauri development app
npm run build        # Build frontend and Tauri Linux bundles
npm run vite:build   # Typecheck and build the frontend only
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript without emitting files
npm test             # Run Node-based frontend tests
```

## Schema Notes

`projects` groups tasks. It stores a name, optional description and color,
archive state, and timestamps. Deleting a project cascades to its tasks.

`tasks` belongs to one project. It stores title, optional description, status,
priority, optional due/completion dates, sort order, and timestamps. Indexed
fields support project ordering, smart views, and completed groupings.

`app_settings` stores single-user app preferences as JSON text by key.

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

Bundle outputs are written under:

```text
src-tauri/target/release/bundle/
```

To validate the Tauri app without creating bundles:

```bash
npx tauri build --no-bundle
```

### Arch Linux Package

The repository includes a root-level `PKGBUILD` for creating a local Arch
package. This environment uses Node.js and npm through nvm, so source nvm before
running `makepkg`:

```bash
source ~/.nvm/nvm.sh
makepkg -f
```

The generated package is written to the repository root:

```text
yeeahnis-todo-0.1.0-1-x86_64.pkg.tar.zst
```

Install it locally with pacman:

```bash
sudo pacman -U yeeahnis-todo-0.1.0-1-x86_64.pkg.tar.zst
```

The package installs:

- `/usr/bin/gnome-tauri-todo`
- `/usr/share/applications/gnome-tauri-todo.desktop`
- hicolor app icons at 32, 64, 128, 256, and 512 px

## Project Layout

```text
src/
  components/        Shared UI primitives
  features/          Feature modules for projects, tasks, settings
  layouts/           App shell and navigation
  lib/               Shared utilities and Tauri API clients
  pages/             Route-level screens
  stores/            Zustand UI/cache stores
src-tauri/           Tauri v2 Rust application, SQLite setup, and commands
scripts/             Test and development helpers
```
