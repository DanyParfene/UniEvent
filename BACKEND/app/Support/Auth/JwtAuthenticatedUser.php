<?php

declare(strict_types=1);

namespace App\Support\Auth;

use App\Support\Contracts\AuthenticatedUser;
use Illuminate\Foundation\Auth\Access\Authorizable;

/**
 * Lightweight DTO built from decoded JWT claims.
 * Zero database interaction — all data comes from the signed token.
 */
final class JwtAuthenticatedUser implements
    \Illuminate\Contracts\Auth\Authenticatable,
    \Illuminate\Contracts\Auth\Access\Authorizable,
    AuthenticatedUser
{
    use Authorizable;

    public function __construct(
        public readonly int $id,
        public readonly string $email,
        public readonly ?string $department,
        public readonly ?string $role,
    ) {}

    // Authenticatable contract
    public function getAuthIdentifier(): mixed
    {
        return $this->id;
    }

    public function getAuthIdentifierName(): string
    {
        return 'id';
    }

    public function getAuthPassword(): string
    {
        return '';
    }

    public function getAuthPasswordName(): string
    {
        return 'password';
    }

    public function getRememberToken(): ?string
    {
        return null;
    }

    public function setRememberToken($value): void {}

    public function getRememberTokenName(): string
    {
        return '';
    }

    // AuthenticatedUser contract — single-role string comparison (no Spatie DB call)
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles, true);
    }
}
