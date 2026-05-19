# Repository Guidelines

## Project Structure & Module Organization

This repository is currently a planning scaffold for a GNOME-inspired Tauri TODO app. Follow the intended layout from `gnome_tauri_todo_app_agentic_task_list.md` as implementation begins:

- `src/`: React + TypeScript frontend code.
- `src/components/`: shared UI components, including shadcn/ui wrappers.
- `src/features/`: feature modules such as projects, tasks, settings, and search.
- `src/layouts/`: app shell, sidebar, header bar, and page frames.
- `src/lib/`: shared utilities, Tauri API clients, Prisma/browser-safe helpers.
- `src/pages/`: route-level screens.
- `src/stores/`: Zustand or query/cache state.
- `src-tauri/`: Tauri v2 Rust application, commands, and desktop configuration.
- `prisma/`: schema and migrations.
- `docker/`: local service configuration and database scripts.

## Build, Test, and Development Commands

No package manifests are present yet. Once the app is scaffolded, keep commands in `package.json` and prefer these names:

- `npm run dev`: start the Tauri development app.
- `npm run build`: build the frontend and Tauri desktop bundle.
- `npm run lint`: run TypeScript, React, and style linting.
- `npm test`: run the frontend test suite.
- `docker compose up -d`: start PostgreSQL for local development.
- `npx prisma migrate dev`: apply local database migrations.

## Coding Style & Naming Conventions

Use TypeScript for frontend code and Rust for Tauri commands. Prefer 2-space indentation in TypeScript, React, CSS, and JSON. Use `PascalCase` for React components, `camelCase` for functions and variables, and `kebab-case` for route or asset filenames. Keep feature-specific code inside `src/features/<feature>/` and promote code to `src/components/` or `src/lib/` only when reused.

## Testing Guidelines

Add tests with the implementation they cover. Use colocated names such as `TaskList.test.tsx` or feature-level `*.spec.ts`. Cover repository functions, Tauri command boundaries, and core task/project workflows. Database tests should use an isolated test database or disposable Docker Compose service.

## Commit & Pull Request Guidelines

This directory is not currently a Git repository, so no local commit convention exists yet. Use concise, imperative commits such as `Add task repository` or `Configure Prisma schema`. Pull requests should include a short summary, testing performed, linked issue or task reference, and screenshots for UI changes.

## Security & Configuration Tips

Do not commit real secrets. Store local database settings in `.env`, with `DATABASE_URL` pointing to the Docker PostgreSQL service. Keep Tauri command errors frontend-safe and avoid exposing raw database or filesystem errors to the UI.
