#!/usr/bin/env bash
set -e

until PGPASSWORD=$DB_PASSWORD psql -h "${DB_HOST}" -U "${DB_USER}" -c '\q'; do
  sleep 1
done

# need to wait for PSQL to be ready for connections before migrations
php artisan migrate
php artisan db:seed
php artisan key:generate

laravel-echo-server start &
php artisan serve --host=0.0.0.0 --port=8000
