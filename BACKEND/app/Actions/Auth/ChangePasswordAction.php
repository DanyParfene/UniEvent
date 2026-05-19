<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

final class ChangePasswordAction
{
    public function execute(User $user, string $oldPassword, string $newPassword): void
    {
        if (! Hash::check($oldPassword, $user->getAuthPassword())) {
            throw ValidationException::withMessages([
                'old_password' => [__('auth.password')],
            ]);
        }

        $user->forceFill([
            'password' => $newPassword,
        ])->save();
    }
}
