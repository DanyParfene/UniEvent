<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use App\Models\Partner;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    public function test_unauthenticated_requests_receive_401(): void
    {
        $this->getJson('/api/events')->assertUnauthorized();
    }

    public function test_coordinator_cannot_access_super_admin_user_routes(): void
    {
        $coordinator = $this->coordinator();

        $this->actingAsApi($coordinator)
            ->getJson('/api/users')
            ->assertForbidden();
    }

    public function test_department_administrator_can_manage_partners(): void
    {
        $admin = $this->departmentAdmin(['department' => 'Informatică']);

        $this->actingAsApi($admin)
            ->postJson('/api/partners', ['name' => 'Partner UVT'])
            ->assertCreated()
            ->assertJsonPath('data.name', 'Partner UVT');

        $partner = Partner::query()->where('name', 'Partner UVT')->firstOrFail();

        $this->actingAsApi($admin)
            ->putJson("/api/partners/{$partner->id}", ['name' => 'Partner UVT Updated'])
            ->assertOk();
    }

    public function test_coordinator_cannot_create_partners(): void
    {
        $coordinator = $this->coordinator();

        $this->actingAsApi($coordinator)
            ->postJson('/api/partners', ['name' => 'Blocked Partner'])
            ->assertForbidden();
    }
}
