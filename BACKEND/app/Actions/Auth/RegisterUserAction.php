<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\Models\User;
use App\Services\Auth\JwtTokenService;
use App\Support\RoleName;

final class RegisterUserAction
{
    public function __construct(
        private readonly JwtTokenService $tokenService,
    ) {}

    /**
     * @return array{user: User, access_token: string, refresh_token: string}
     */
    public function execute(string $name, string $email, string $password, string $department): array
    {
        $user = User::query()->create([
            'name'       => $name,
            'email'      => $email,
            'password'   => $password,
            'department' => $department,
        ]);

        $user->assignRole(RoleName::COORDINATOR);
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
