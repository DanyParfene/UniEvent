<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * Logs the total wall-clock time for every API request.
 * Check storage/logs/laravel.log for [TRACE] request.complete lines.
 */
final class RequestTimingMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $start = microtime(true);

        $response = $next($request);

        $ms = round((microtime(true) - $start) * 1000, 3);

        Log::debug('[TRACE] request.complete', [
            'method'     => $request->method(),
            'path'       => $request->path(),
            'status'     => $response->getStatusCode(),
            'ms'         => $ms,
            'memory_mb'  => round(memory_get_peak_usage(true) / 1024 / 1024, 2),
        ]);

        return $response;
    }
}
