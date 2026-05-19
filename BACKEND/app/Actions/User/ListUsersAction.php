<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

final class ListUsersAction
{
    /**
     * @return Collection<int, User>
     */
    public function execute(): Collection
    {
        return User::query()
            ->with('roles')
            ->orderBy('name')
            ->get();
    }
}
