<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\Models\User;

final class LogoutUserAction
{
    public function execute(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }
}
