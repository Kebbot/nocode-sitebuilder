# tools/scripts/wait-for-postgres.sh
#!/usr/bin/env bash
set -e

host="${DB_HOST:-postgres}"
port="${DB_PORT:-5432}"
user="${DB_USER:-postgres}"
db="${DB_NAME:-postgres}"

echo "Waiting for PostgreSQL at $host:$port (db: $db, user: $user)..."
until PGPASSWORD="$DB_PASSWORD" psql -h "$host" -p "$port" -U "$user" -d "$db" -c '\q' >/dev/null 2>&1; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is up."
exit 0