<?php

declare(strict_types=1);

namespace Tests\Unit\Services;

use App\Services\User\LastSuperAdminGuard;
use App\Support\RoleName;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class LastSuperAdminGuardTest extends TestCase
{
    private LastSuperAdminGuard $guard;

    protected function setUp(): void
    {
        parent::setUp();

        $this->guard = new LastSuperAdminGuard;
    }

    public function test_allows_demotion_when_multiple_super_administrators_exist(): void
    {
        $actor = $this->superAdmin(['email' => 'super.one@e-uvt.ro']);
        $this->superAdmin(['email' => 'super.two@e-uvt.ro']);

        $this->guard->ensureCanChangeRole($actor, RoleName::COORDINATOR, $actor);

        $this->assertTrue($actor->hasRole(RoleName::SUPER_ADMINISTRATOR));
    }

    public function test_blocks_sole_super_administrator_from_self_demotion(): void
    {
        $sole = $this->superAdmin(['email' => 'sole@e-uvt.ro']);

        $this->expectException(ValidationException::class);

        $this->guard->ensureCanChangeRole($sole, RoleName::COORDINATOR, $sole);
    }

    public function test_allows_super_administrator_to_change_another_users_role(): void
    {
        $actor = $this->superAdmin(['email' => 'actor@e-uvt.ro']);
        $target = $this->coordinator(['email' => 'target@e-uvt.ro']);

        $this->guard->ensureCanChangeRole($target, RoleName::DEPARTMENT_ADMINISTRATOR, $actor);

        $this->assertTrue($target->hasRole(RoleName::COORDINATOR));
    }
}
