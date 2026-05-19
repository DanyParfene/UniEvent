<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use Illuminate\Support\Facades\Password;

final class SendPasswordResetLinkAction
{
    public function execute(string $email): string
    {
        return Password::broker()->sendResetLink(['email' => $email]);
    }
}
