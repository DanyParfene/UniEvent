<?php

namespace App\Http\Middleware;

use Illuminate\Cookie\Middleware\EncryptCookies as Middleware;

class EncryptCookies extends Middleware
{
    /**
     * The names of the cookies that should not be encrypted.
     * The refresh_token is a self-validating signed JWT; Laravel encryption is unnecessary
     * and would prevent direct decoding in the refresh endpoint.
     *
     * @var array<int, string>
     */
    protected $except = [
        'refresh_token',
    ];
}
