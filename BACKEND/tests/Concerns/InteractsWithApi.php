<?php

declare(strict_types=1);

namespace Tests\Concerns;

use App\Models\User;
use App\Support\RoleName;
use Database\Seeders\RoleSeeder;
use Laravel\Sanctum\Sanctum;

trait InteractsWithApi
{
    protected function seedRoles(): void
    {
        $this->seed(RoleSeeder::class);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    protected function createUserWithRole(string $role, array $attributes = []): User
    {
        $user = User::factory()->create($attributes);
        $user->assignRole($role);

        return $user->fresh('roles');
    }

    protected function actingAsApi(User $user): static
    {
        Sanctum::actingAs($user, ['*']);

        return $this;
    }

    protected function coordinator(array $attributes = []): User
    {
        return $this->createUserWithRole(RoleName::COORDINATOR, $attributes);
    }

    protected function departmentAdmin(array $attributes = []): User
    {
        return $this->createUserWithRole(RoleName::DEPARTMENT_ADMINISTRATOR, $attributes);
    }

    protected function superAdmin(array $attributes = []): User
    {
        return $this->createUserWithRole(RoleName::SUPER_ADMINISTRATOR, $attributes);
    }
}
