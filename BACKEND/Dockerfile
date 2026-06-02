FROM php:8.3-fpm-alpine

ENV COMPOSER_ALLOW_SUPERUSER=1
ENV COMPOSER_NO_INTERACTION=1

# --- Runtime packages (stay in the final image) ---
RUN apk add --no-cache \
        unzip \
        nginx \
        supervisor \
        mariadb-client \
        icu-libs \
        libzip \
        libpng \
        libjpeg-turbo \
        freetype \
    # --- Build-only deps (removed after compilation) ---
    && apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        icu-dev \
        libzip-dev \
        libpng-dev \
        libjpeg-turbo-dev \
        freetype-dev \
        libxml2-dev \
        linux-headers \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        bcmath \
        gd \
        intl \
        opcache \
        pcntl \
        pdo_mysql \
        zip \
    && apk del .build-deps \
    && rm -rf /tmp/pear /var/cache/apk/*

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

WORKDIR /var/www/html

# Copy only dependency files first to leverage Docker layer caching.
# This layer is only rebuilt when composer.json or composer.lock changes.
COPY composer.json composer.lock ./

# Install ALL dependencies (including dev) at build time. This does two things:
# 1) Warms the Composer package cache inside the image (/root/.composer/cache)
# 2) Pre-populates vendor/ as a fallback baseline
# The runtime entrypoint re-runs "composer install" but it hits the warm cache
# and finishes in seconds instead of downloading from the internet.
RUN composer install --prefer-dist --optimize-autoloader --no-scripts

# Copy the rest of the application code
COPY . /var/www/html

RUN mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R ug+rwx storage bootstrap/cache

COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN sed -i 's/\r$//' /var/www/html/docker/entrypoint.sh \
    && cp /var/www/html/docker/entrypoint.sh /usr/local/bin/entrypoint.sh \
    && chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

CMD ["php", "artisan", "queue:work", "redis", "--verbose", "--tries=3", "--timeout=90"]
