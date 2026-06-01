<?php

declare(strict_types=1);

namespace App\Support\Contracts;

interface AuthenticatedUser
{
    public function getAuthIdentifier(): mixed;

    public function hasRole(string $role): bool;

    public function hasAnyRole(array $roles): bool;
}
