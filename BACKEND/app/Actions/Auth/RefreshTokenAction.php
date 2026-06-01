<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\Models\User;
use App\Services\Auth\JwtTokenService;
use App\Support\Trace;

final class RefreshTokenAction
{
    public function __construct(
        private readonly JwtTokenService $tokenService,
    ) {}

    /**
     * Rotate the refresh token and issue a fresh JWT pair.
     *
     * Returns null when the refresh token is invalid, expired, or fraud is detected.
     * Fraud: a token is reused after it was already rotated — the session is killed.
     *
     * @return array{access_token: string, refresh_token: string, user: User}|null
     */
    public function execute(string $refreshTokenFromCookie): ?array
    {
        $t0 = Trace::now();

        $t1 = Trace::now();
        $decoded = $this->tokenService->decodeRefreshToken($refreshTokenFromCookie);
        Trace::mark('refresh.decode_jwt', $t1);

        if ($decoded === null) {
            return null;
        }

        [$userId, $presentedJti] = $decoded;

        $t2 = Trace::now();
        $storedJti = $this->tokenService->getStoredJti($userId);
        Trace::mark('refresh.redis_get_jti', $t2, ['user_id' => $userId]);

        if ($storedJti === null) {
            return null;
        }

        if ($storedJti !== $presentedJti) {
            // Fraud detected: token was already rotated by someone else. Kill the session.
            $this->tokenService->deleteRefreshJti($userId);

            return null;
        }

        $t3 = Trace::now();
        $user = User::with('roles')->findOrFail($userId);
        Trace::mark('refresh.db_load_user', $t3, ['user_id' => $userId]);

        $t4 = Trace::now();
        $accessToken = $this->tokenService->generateAccessToken($user);
        Trace::mark('refresh.encode_access_token', $t4);

        $t5 = Trace::now();
        [$refreshToken, $newJti] = $this->tokenService->generateRefreshToken($user);
        Trace::mark('refresh.encode_refresh_token', $t5);

        $t6 = Trace::now();
        $this->tokenService->storeRefreshJti($userId, $newJti);
        Trace::mark('refresh.redis_store_jti', $t6);

        Trace::mark('refresh.total', $t0, ['user_id' => $userId]);

        return [
            'access_token'  => $accessToken,
            'refresh_token' => $refreshToken,
            'user'          => $user,
        ];
    }
}
