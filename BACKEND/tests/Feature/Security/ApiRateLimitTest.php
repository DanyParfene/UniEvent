<?php

declare(strict_types=1);

namespace Tests\Feature\Security;

use App\Jobs\GenerateReportJob;
use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class ApiRateLimitTest extends TestCase
{
    /** Isolated IPs so throttle tests do not exhaust limits for the rest of the suite. */
    private const LOGIN_TEST_IP = '198.51.100.10';

    private const API_GET_TEST_IP = '198.51.100.11';

    protected function setUp(): void
    {
        parent::setUp();
    }

    /**
     * Named limiters store hits under md5("{$limiterName}{$by}") (see ThrottleRequests).
     * Clearing the limiter name alone does not reset counters shared with the full suite.
     */
    private function clearNamedRateLimiter(string $limiterName, string|int $by): void
    {
        RateLimiter::clear(md5($limiterName.$by));
    }

    public function test_login_returns_429_after_five_attempts_per_minute(): void
    {
        $this->withServerVariables(['REMOTE_ADDR' => self::LOGIN_TEST_IP]);
        $this->clearNamedRateLimiter('login', self::LOGIN_TEST_IP);

        User::factory()->create([
            'email' => 'login.throttle@e-uvt.ro',
            'password' => Hash::make('password'),
        ]);

        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/auth/login', [
                'email' => 'login.throttle@e-uvt.ro',
                'password' => 'wrong-password',
            ])->assertUnauthorized();
        }

        $this->postJson('/api/auth/login', [
            'email' => 'login.throttle@e-uvt.ro',
            'password' => 'wrong-password',
        ])->assertTooManyRequests();
    }

    public function test_report_generation_returns_429_after_two_requests_per_minute(): void
    {
        Queue::fake();

        $coordinator = $this->coordinator([
            'email' => 'report.throttle@e-uvt.ro',
            'department' => 'Informatică',
        ]);

        $this->clearNamedRateLimiter('report', $coordinator->getAuthIdentifier());

        $event = Event::factory()->forCoordinator('report.throttle@e-uvt.ro', 'Informatică')->create();

        for ($attempt = 0; $attempt < 2; $attempt++) {
            $this->actingAsApi($coordinator)
                ->postJson('/api/generate-report', ['event_ids' => [$event->id]])
                ->assertAccepted();
        }

        $this->actingAsApi($coordinator)
            ->postJson('/api/generate-report', ['event_ids' => [$event->id]])
            ->assertTooManyRequests();

        Queue::assertPushed(GenerateReportJob::class, 2);
    }

    public function test_api_get_returns_429_after_sixty_requests_per_minute(): void
    {
        $this->withServerVariables(['REMOTE_ADDR' => self::API_GET_TEST_IP]);
        $this->clearNamedRateLimiter('api', self::API_GET_TEST_IP);

        for ($attempt = 0; $attempt < 60; $attempt++) {
            $this->getJson('/api/health')->assertOk();
        }

        $this->getJson('/api/health')->assertTooManyRequests();
    }
}
