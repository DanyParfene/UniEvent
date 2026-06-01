<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Support\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Route-level role authorization. Reads the role from the X-User-Role header
 * that JwtAuthMiddleware populates. Zero database queries.
 */
final class RoleAuthMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $userRole = $request->headers->get('X-User-Role');

        // Laravel splits middleware params on ',' (e.g. role:a,b → two args).
        // Support the Spatie-style '|' OR separator too (e.g. role:a|b → one arg).
        $allowed = array_merge(...array_map(fn(string $r) => explode('|', $r), $roles));

        if ($userRole === null || ! in_array($userRole, $allowed, true)) {
            return ApiResponse::error('This action is unauthorized.', Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
