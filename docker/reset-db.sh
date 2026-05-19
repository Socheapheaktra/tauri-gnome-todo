#!/usr/bin/env bash
set -euo pipefail

docker compose stop postgres adminer
docker compose rm -f postgres adminer
docker volume rm tauri_postgres_data 2>/dev/null || true
docker compose up -d postgres adminer
docker compose ps
