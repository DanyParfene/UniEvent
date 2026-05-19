<?php

declare(strict_types=1);

namespace Tests\Feature\User;

use App\Support\RoleName;
use Tests\TestCase;

class UserRoleManagementTest extends TestCase
{
    public function test_super_administrator_can_list_users(): void
    {
        $this->coordinator(['email' => 'listed@e-uvt.ro']);
        $superAdmin = $this->superAdmin();

        $response = $this->actingAsApi($superAdmin)->getJson('/api/users');

        $response->assertOk()
            ->assertJsonStructure(['data' => ['users' => [['id', 'name', 'email', 'current_role']]]]);

        $emails = collect($response->json('data.users'))->pluck('email');
        $this->assertTrue($emails->contains('listed@e-uvt.ro'));
    }

    public function test_role_update_rejects_invalid_role_name(): void
    {
        $superAdmin = $this->superAdmin();
        $target = $this->coordinator(['email' => 'role.target@e-uvt.ro']);

        $this->actingAsApi($superAdmin)
            ->putJson("/api/users/{$target->id}/role", ['role_name' => 'invalid_role'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['role_name']);
    }

    public function test_super_administrator_can_promote_user_role(): void
    {
        $superAdmin = $this->superAdmin();
        $target = $this->coordinator(['email' => 'promote.me@e-uvt.ro']);

        $this->actingAsApi($superAdmin)
            ->putJson("/api/users/{$target->id}/role", ['role_name' => RoleName::DEPARTMENT_ADMINISTRATOR])
            ->assertOk()
            ->assertJsonPath('data.current_role', RoleName::DEPARTMENT_ADMINISTRATOR);

        $target->refresh();
        $this->assertTrue($target->hasRole(RoleName::DEPARTMENT_ADMINISTRATOR));
    }

    public function test_last_super_administrator_cannot_demote_themselves(): void
    {
        $soleSuperAdmin = $this->superAdmin(['email' => 'sole.super@e-uvt.ro']);

        $this->actingAsApi($soleSuperAdmin)
            ->putJson("/api/users/{$soleSuperAdmin->id}/role", ['role_name' => RoleName::COORDINATOR])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['role_name']);

        $this->assertTrue($soleSuperAdmin->fresh()->hasRole(RoleName::SUPER_ADMINISTRATOR));
    }
}
