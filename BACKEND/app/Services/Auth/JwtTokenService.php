<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Cookie;

/**
 * Centralized service for JWT access token, refresh JWT, and Redis JTI operations.
 * All refresh Redis keys follow the pattern: refresh:{user_id}
 */
final class JwtTokenService
{
    private const REFRESH_KEY_PREFIX = 'refresh:';
    private const REFRESH_TTL_SECONDS = 86400; // 1 day

    public function generateAccessToken(User $user): string
    {
        return JWTAuth::fromUser($user);
    }

    /**
     * @return array{0: string, 1: string} [jwt_string, jti]
     */
    public function generateRefreshToken(User $user): array
    {
        $jti = (string) Str::uuid();

        $ttlMinutes = (int) config('jwt.refresh_ttl', 1440);

        $customClaims = [
            'jti'  => $jti,
            'type' => 'refresh',
            'sub'  => $user->getKey(),
        ];

        JWTAuth::factory()->setTTL($ttlMinutes);
        $token = JWTAuth::claims($customClaims)->fromUser($user);

        // Restore the singleton TTL — setTTL() mutates the shared PayloadFactory.
        // Without this, any subsequent JWTAuth::fromUser() in the same PHP worker
        // would issue access tokens with 1440-min TTL instead of the configured 5 min.
        JWTAuth::factory()->setTTL((int) config('jwt.ttl', 60));

        return [$token, $jti];
    }

    public function storeRefreshJti(int|string $userId, string $jti): void
    {
        $key = self::REFRESH_KEY_PREFIX . $userId;
        Redis::setex($key, self::REFRESH_TTL_SECONDS, $jti);
    }

    public function getStoredJti(int|string $userId): ?string
    {
        $value = Redis::get(self::REFRESH_KEY_PREFIX . $userId);

        return $value !== null ? (string) $value : null;
    }

    public function deleteRefreshJti(int|string $userId): void
    {
        Redis::del(self::REFRESH_KEY_PREFIX . $userId);
    }

    /**
     * Decode a refresh token JWT and return [user_id, jti] or null on failure.
     *
     * @return array{0: int, 1: string}|null
     */
    public function decodeRefreshToken(string $token): ?array
    {
        try {
            $payload = JWTAuth::setToken($token)->getPayload();
        } catch (JWTException) {
            return null;
        }

        if ($payload->get('type') !== 'refresh') {
            return null;
        }

        $userId = $payload->get('sub');
        $jti    = $payload->get('jti');

        if ($userId === null || $jti === null) {
            return null;
        }

        return [(int) $userId, (string) $jti];
    }

    public function buildRefreshCookie(string $token): Cookie
    {
        return Cookie::create(
            name:     'refresh_token',
            value:    $token,
            expire:   time() + self::REFRESH_TTL_SECONDS,
            path:     '/api/auth/refresh',
            domain:   null,
            secure:   ! app()->isLocal(),
            httpOnly: true,
            raw:      false,
            sameSite: Cookie::SAMESITE_STRICT,
        );
    }

    public function buildExpiredRefreshCookie(): Cookie
    {
        return Cookie::create(
            name:     'refresh_token',
            value:    '',
            expire:   1,
            path:     '/api/auth/refresh',
            domain:   null,
            secure:   ! app()->isLocal(),
            httpOnly: true,
            raw:      false,
            sameSite: Cookie::SAMESITE_STRICT,
        );
    }
}
