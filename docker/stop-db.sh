#!/usr/bin/env bash
set -euo pipefail

docker compose stop postgres adminer
docker compose rm -f postgres adminer
