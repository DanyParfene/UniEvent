<?php

declare(strict_types=1);

namespace Tests;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Redis;
use Tests\Concerns\BuildsEventPayload;
use Tests\Concerns\InteractsWithApi;

abstract class TestCase extends \Illuminate\Foundation\Testing\TestCase
{
    use BuildsEventPayload;
    use InteractsWithApi;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seedRoles();
        $this->flushRedisTestDatabase();
    }

    /**
     * Rate limiter and cache keys persist in Redis across tests and suite runs.
     */
    private function flushRedisTestDatabase(): void
    {
        if (config('cache.default') !== 'redis') {
            return;
        }

        Redis::connection()->flushdb();
    }
}
