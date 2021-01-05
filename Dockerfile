FROM php:7.4-alpine

RUN apk add --no-cache --virtual .build-deps \
    $PHPIZE_DEPS \
    curl-dev \
    imagemagick-dev \
    libtool \
    libxml2-dev \
    postgresql-dev

RUN apk add --no-cache \
    bash \
    curl \
    freetype-dev \
    g++ \
    gcc \
    git \
    icu-dev \
    icu-libs \
    imagemagick \
    libc-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    libzip-dev \
    make \
    nodejs \
    nodejs-npm \
    oniguruma-dev \
    postgresql-client \
    postgresql-libs \
    yarn \
    openssh-client \
    rsync \
    supervisor \
    zlib-dev

RUN pecl install \
    redis \
    imagick \
    xdebug

# enable redis php extension
RUN docker-php-ext-enable redis

# Configure php extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg

# Install php extensions
RUN docker-php-ext-install \
    bcmath \
    calendar \
    curl \
    exif \
    gd \
    iconv \
    intl \
    mbstring \
    pdo \
    pdo_pgsql \
    pcntl \
    tokenizer \
    xml \
    zip

RUN npm install -g laravel-echo-server

# Install composer
ENV COMPOSER_HOME /composer
ENV PATH ./vendor/bin:/composer/vendor/bin:$PATH
ENV COMPOSER_ALLOW_SUPERUSER 1
RUN curl -s https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin/ --filename=composer

WORKDIR /app
COPY . /app

RUN composer install
RUN npm install

RUN apk del -f .build-deps

EXPOSE 8000
EXPOSE 6001

CMD php artisan serve --host=0.0.0.0 --port=8000
