<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Support\ApiResponse;
use App\Support\Auth\JwtAuthenticatedUser;
use App\Support\Trace;
use Closure;
use Illuminate\Http\Request;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Stateless JWT authentication gate. Zero database queries on normal requests.
 * Decodes the Bearer token, builds a JwtAuthenticatedUser DTO from claims,
 * and sets it as the authenticated user for the remainder of the request.
 */
final class JwtAuthMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $t0 = Trace::now();

        $token = $request->bearerToken();

        if ($token === null || $token === '') {
            return ApiResponse::error('Unauthenticated.', Response::HTTP_UNAUTHORIZED);
        }

        try {
            $t1 = Trace::now();
            $payload = JWTAuth::setToken($token)->getPayload();
            Trace::mark('jwt_middleware.decode', $t1);
        } catch (TokenExpiredException) {
            return ApiResponse::error('Token expired.', Response::HTTP_UNAUTHORIZED);
        } catch (JWTException) {
            return ApiResponse::error('Invalid token.', Response::HTTP_UNAUTHORIZED);
        }

        $dto = new JwtAuthenticatedUser(
            id:         (int) $payload->get('sub'),
            email:      (string) $payload->get('email'),
            department: $payload->get('department'),
            role:       $payload->get('role'),
        );

        $t2 = Trace::now();
        auth()->setUser($dto);
        Trace::mark('jwt_middleware.set_user', $t2, ['guard' => config('auth.defaults.guard')]);

        $request->headers->set('X-User-Id', (string) $dto->id);
        $request->headers->set('X-User-Role', (string) $dto->role);
        $request->headers->set('X-User-Department', (string) $dto->department);
        $request->headers->set('X-User-Email', $dto->email);

        Trace::mark('jwt_middleware.total', $t0);

        return $next($request);
    }
}
