<?php

declare(strict_types=1);

namespace App\Services\User;

use App\Models\User;
use App\Support\RoleName;
use Illuminate\Validation\ValidationException;

final class LastSuperAdminGuard
{
    /**
     * Prevent the sole super administrator from demoting themselves.
     *
     * @throws ValidationException
     */
    public function ensureCanChangeRole(User $target, string $newRoleName, User $actor): void
    {
        if ($newRoleName === RoleName::SUPER_ADMINISTRATOR) {
            return;
        }

        if ($actor->id !== $target->id) {
            return;
        }

        if (! $target->hasRole(RoleName::SUPER_ADMINISTRATOR)) {
            return;
        }

        if ($this->superAdministratorCount() > 1) {
            return;
        }

        throw ValidationException::withMessages([
            'role_name' => ['Cannot change role: you are the last super administrator.'],
        ]);
    }

    private function superAdministratorCount(): int
    {
        return User::query()
            ->role(RoleName::SUPER_ADMINISTRATOR)
            ->count();
    }
}
