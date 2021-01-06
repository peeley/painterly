# Painterly
Self-hosted web app to allow for quick sketches to save for later or share
with others.

Disclaimer: this project is still in early development, and as such most likely
contains bugs or missing features.

# Deploying
Deployment can be done via the Docker files in this repo by running:

``` sh
git clone https://github.com/peeley/painterly
cd painterly
docker-compose build
docker-compose up -d
```

This should start all the necessary services, and expose the web app on
localhost:8000.

# Development
For development, you'll need `composer` and `npm` installed. Run the following:

``` sh
git clone https://github.com/peeley/painterly
cd painterly
composer install
npm install
docker-compose build
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

Local changes will be reflected inside the docker container. If you make any
changes to the JS, you'll have to run `npm run watch` for them to auto-compile.

# Built with ♥ and
- Laravel
- React
- fabric.js
- PostgreSQL
- Docker

# Contributing
Please feel free to file an issue or write a pull request, there are several
areas of the project that I've probably neglected or have done an amateurish job
on.
