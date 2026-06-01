<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\Services\Auth\JwtTokenService;
use App\Support\Contracts\AuthenticatedUser;

final class LogoutUserAction
{
    public function __construct(
        private readonly JwtTokenService $tokenService,
    ) {}

    public function execute(AuthenticatedUser $user): void
    {
        $this->tokenService->deleteRefreshJti($user->getAuthIdentifier());
    }
}
