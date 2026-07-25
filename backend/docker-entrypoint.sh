#!/bin/sh
set -e

cd /var/www/html

if [ ! -f .env ]; then
  cp .env.example .env
fi

if [ -z "$(grep '^APP_KEY=' .env | cut -d= -f2)" ]; then
  php artisan key:generate --force
fi

touch database/database.sqlite
chmod 664 database/database.sqlite

php artisan migrate --force
php artisan db:seed --force

exec "$@"
