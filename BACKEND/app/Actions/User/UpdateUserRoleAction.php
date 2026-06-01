<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\Models\User;
use App\Services\User\LastSuperAdminGuard;
use App\Support\Contracts\AuthenticatedUser;
use Illuminate\Support\Facades\DB;

final class UpdateUserRoleAction
{
    public function __construct(
        private readonly LastSuperAdminGuard $lastSuperAdminGuard,
    ) {}

    public function execute(User $target, string $roleName, AuthenticatedUser $actor): User
    {
        $this->lastSuperAdminGuard->ensureCanChangeRole($target, $roleName, $actor);

        return DB::transaction(function () use ($target, $roleName): User {
            $target->syncRoles([$roleName]);
            $target->load('roles');

            return $target;
        });
    }
}
