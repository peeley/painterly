# Painterly
Self-hosted web app to allow for quick sketches to save for later or share
with others.

Disclaimer: this project is still in early development, and as such most likely
contains bugs or missing features.

# Deploying
TODO

# Development
Development can be done either locally or on the Docker image. To develop 
locally you'll need `composer` and `npm` installed. Then, run
``` sh
git clone https://github.com/peeley/painterly
cd painterly
composer install
npm run dev
php artisan serve
```
You should see the development server start. If you make any changes to the JS,
you'll have to run `npm run watch` for them to auto-compile.

# Built with ♥ and
- Laravel
- React
- fabric.js
- PostgreSQL

# Contributing
Please feel free to write a pull request, there are several areas of the project
that I've probably neglected or have done an amateurish job on.
