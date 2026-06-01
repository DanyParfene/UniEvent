<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\Models\User;
use App\Services\Auth\JwtTokenService;
use Illuminate\Support\Facades\Hash;

final class LoginUserAction
{
    public function __construct(
        private readonly JwtTokenService $tokenService,
    ) {}

    /**
     * @return array{user: User, access_token: string, refresh_token: string}|null
     */
    public function execute(string $email, string $password): ?array
    {
        $user = User::query()->where('email', $email)->first();

        if ($user === null || ! Hash::check($password, $user->getAuthPassword())) {
            return null;
        }

        $user->load('roles');

        $accessToken = $this->tokenService->generateAccessToken($user);
        [$refreshToken, $jti] = $this->tokenService->generateRefreshToken($user);
        $this->tokenService->storeRefreshJti($user->id, $jti);

        return [
            'user'          => $user,
            'access_token'  => $accessToken,
            'refresh_token' => $refreshToken,
        ];
    }
}
