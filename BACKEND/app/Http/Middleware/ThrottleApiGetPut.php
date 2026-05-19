<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Symfony\Component\HttpFoundation\Response;

/**
 * Applies the architecture "general API" limiter (60/min per user) only to GET and PUT.
 */
final class ThrottleApiGetPut
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! in_array($request->getMethod(), ['GET', 'PUT'], true)) {
            return $next($request);
        }

        return app(ThrottleRequests::class)->handle($request, $next, 'api');
    }
}
