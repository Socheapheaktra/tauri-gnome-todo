# Local Database

Start PostgreSQL and Adminer:

```bash
npm run db:start
```

Stop services:

```bash
npm run db:stop
```

Reset the local database volume:

```bash
npm run db:reset
```

Avoid `docker compose down` in this repository. Use service-scoped commands such as
`docker compose stop postgres adminer` and `docker compose rm -f postgres adminer`
so unrelated containers are not removed.

Adminer runs at `http://localhost:8080`.

PostgreSQL runs on `localhost:5432` by default for Prisma and the desktop app:

```text
postgresql://todo_user:todo_password@localhost:5432/todo_app
```

Use these credentials unless overridden in `.env`:

- System: `PostgreSQL`
- Server: `localhost`
- Username: `todo_user`
- Password: `todo_password`
- Database: `todo_app`
