<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Support\RoleName;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    public function test_registration_rejects_non_uvt_email_domain(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'user@gmail.com',
            'password' => 'Password1!',
            'department' => 'Informatică',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_registration_assigns_coordinator_role_and_returns_token(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Coordonator Nou',
            'email' => 'nou.coord@e-uvt.ro',
            'password' => 'Password1!',
            'department' => 'Informatică',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.user.current_role', RoleName::COORDINATOR)
            ->assertJsonStructure(['data' => ['token', 'user' => ['id', 'email', 'department']]]);

        $this->assertDatabaseHas('users', ['email' => 'nou.coord@e-uvt.ro']);
        $this->assertTrue(
            User::query()->where('email', 'nou.coord@e-uvt.ro')->first()?->hasRole(RoleName::COORDINATOR) ?? false
        );
    }

    public function test_login_and_logout_flow(): void
    {
        $user = $this->coordinator(['email' => 'login.flow@e-uvt.ro']);

        $login = $this->postJson('/api/auth/login', [
            'email' => 'login.flow@e-uvt.ro',
            'password' => 'password',
        ]);

        $login->assertOk()
            ->assertJsonPath('data.user.email', 'login.flow@e-uvt.ro')
            ->assertJsonStructure(['data' => ['token']]);

        $token = $login->json('data.token');

        $this->withToken($token)
            ->postJson('/api/auth/logout')
            ->assertNoContent();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_forgot_password_sends_reset_notification(): void
    {
        Notification::fake();

        $user = $this->coordinator(['email' => 'reset.me@e-uvt.ro']);

        $this->postJson('/api/auth/forgot-password', ['email' => $user->email])
            ->assertOk();

        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function test_reset_password_updates_credentials(): void
    {
        $user = $this->coordinator(['email' => 'reset.done@e-uvt.ro']);
        $token = Password::createToken($user);

        $this->postJson('/api/auth/reset-password', [
            'email' => $user->email,
            'email_token' => $token,
            'new_password' => 'NewPassword1!',
        ])->assertOk();

        $user->refresh();
        $this->assertTrue(Hash::check('NewPassword1!', $user->password));
    }

    public function test_change_password_requires_correct_old_password(): void
    {
        $user = $this->coordinator();

        $this->actingAsApi($user)
            ->postJson('/api/auth/change-password', [
                'old_password' => 'wrong-password',
                'new_password' => 'NewPassword1!',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['old_password']);
    }

    public function test_change_password_persists_new_password(): void
    {
        $user = $this->coordinator();

        $this->actingAsApi($user)
            ->postJson('/api/auth/change-password', [
                'old_password' => 'password',
                'new_password' => 'NewPassword1!',
            ])
            ->assertOk();

        $user->refresh();
        $this->assertTrue(Hash::check('NewPassword1!', $user->password));
    }
}
