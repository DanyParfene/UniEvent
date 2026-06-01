<?php

declare(strict_types=1);

namespace Tests\Feature\Security;

use App\Models\Event;
use App\Models\Partner;
use Tests\TestCase;

class CacheInvalidationTest extends TestCase
{
    public function test_partner_update_refreshes_cached_partner_list(): void
    {
        $admin = $this->departmentAdmin();
        $partner = Partner::factory()->create(['name' => 'Cached Old Name']);

        $this->actingAsApi($admin)->getJson('/api/partners')->assertOk();

        $this->actingAsApi($admin)
            ->putJson("/api/partners/{$partner->id}", ['name' => 'Cached New Name'])
            ->assertOk();

        $this->actingAsApi($admin)
            ->getJson('/api/partners')
            ->assertOk()
            ->assertJsonFragment(['name' => 'Cached New Name'])
            ->assertJsonMissing(['name' => 'Cached Old Name']);
    }

    public function test_event_create_invalidates_statistics_cache(): void
    {
        $coordinator = $this->coordinator([
            'email' => 'stats.cache@e-uvt.ro',
            'department' => 'INFO',
        ]);

        Event::factory()->forCoordinator('stats.cache@e-uvt.ro', 'INFO')->create([
            'start_event_date' => now()->subMonths(2)->toDateString(),
            'number_of_participants' => 100,
        ]);

        $before = $this->actingAsApi($coordinator)
            ->getJson('/api/statistics')
            ->assertOk()
            ->json('data.most_participants');

        $payload = $this->validEventPayload([
            'email' => 'stats.cache@e-uvt.ro',
            'start_event_date' => now()->subMonths(2)->toDateString(),
            'finish_event_date' => now()->subMonths(2)->addWeek()->toDateString(),
            'number_of_participants' => 500,
        ]);

        $this->actingAsApi($coordinator)->postJson('/api/event', $payload)->assertCreated();

        $after = $this->actingAsApi($coordinator)
            ->getJson('/api/statistics')
            ->assertOk()
            ->json('data.most_participants');

        $this->assertSame(100, $before);
        $this->assertSame(500, $after);
    }
}
