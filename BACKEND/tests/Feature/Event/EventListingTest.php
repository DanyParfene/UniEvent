<?php

declare(strict_types=1);

namespace Tests\Feature\Event;

use App\Enums\EventStatus;
use App\Models\Event;
use Tests\TestCase;

class EventListingTest extends TestCase
{
    public function test_listing_excludes_archived_events_by_default(): void
    {
        $coordinator = $this->coordinator(['email' => 'list@e-uvt.ro', 'department' => 'INFO']);

        Event::factory()->forCoordinator('list@e-uvt.ro', 'INFO')->create(['event_name' => 'Activ']);
        Event::factory()->forCoordinator('list@e-uvt.ro', 'INFO')->archived()->create(['event_name' => 'Arhivat']);

        $response = $this->actingAsApi($coordinator)->getJson('/api/events');

        $response->assertOk();
        $names = collect($response->json('data'))->pluck('eventName');

        $this->assertTrue($names->contains('Activ'));
        $this->assertFalse($names->contains('Arhivat'));
    }

    public function test_archived_flag_returns_only_archived_events(): void
    {
        $coordinator = $this->coordinator(['email' => 'archived@e-uvt.ro', 'department' => 'INFO']);

        Event::factory()->forCoordinator('archived@e-uvt.ro', 'INFO')->create(['event_name' => 'Live']);
        Event::factory()->forCoordinator('archived@e-uvt.ro', 'INFO')->archived()->create(['event_name' => 'Doar Arhivat']);

        $response = $this->actingAsApi($coordinator)->getJson('/api/events?archived=1');

        $response->assertOk();
        $names = collect($response->json('data'))->pluck('eventName');

        $this->assertFalse($names->contains('Live'));
        $this->assertTrue($names->contains('Doar Arhivat'));
    }

    public function test_coordinator_listing_is_scoped_to_own_events(): void
    {
        Event::factory()->forCoordinator('mine@e-uvt.ro', 'INFO')->create(['event_name' => 'Al meu']);
        Event::factory()->forCoordinator('theirs@e-uvt.ro', 'INFO')->create(['event_name' => 'Al altuia']);

        $coordinator = $this->coordinator(['email' => 'mine@e-uvt.ro', 'department' => 'INFO']);

        $names = collect(
            $this->actingAsApi($coordinator)->getJson('/api/events')->json('data')
        )->pluck('eventName');

        $this->assertTrue($names->contains('Al meu'));
        $this->assertFalse($names->contains('Al altuia'));
    }

    public function test_department_administrator_sees_only_department_events(): void
    {
        Event::factory()->create([
            'department' => 'INFO',
            'email' => 'a@e-uvt.ro',
            'event_name' => 'Dept INFO',
            'status' => EventStatus::Published->value,
        ]);
        Event::factory()->create([
            'department' => 'FEAA',
            'email' => 'b@e-uvt.ro',
            'event_name' => 'Dept FEAA',
            'status' => EventStatus::Published->value,
        ]);

        $admin = $this->departmentAdmin(['department' => 'INFO']);

        $names = collect(
            $this->actingAsApi($admin)->getJson('/api/events')->json('data')
        )->pluck('eventName');

        $this->assertTrue($names->contains('Dept INFO'));
        $this->assertFalse($names->contains('Dept FEAA'));
    }

    public function test_name_filter_matches_partial_event_names(): void
    {
        $coordinator = $this->coordinator(['email' => 'filter@e-uvt.ro', 'department' => 'INFO']);

        Event::factory()->forCoordinator('filter@e-uvt.ro', 'INFO')->create(['event_name' => 'Zilele Informaticii']);
        Event::factory()->forCoordinator('filter@e-uvt.ro', 'INFO')->create(['event_name' => 'Workshop Design']);

        $names = collect(
            $this->actingAsApi($coordinator)
                ->getJson('/api/events?name=Informatic')
                ->json('data')
        )->pluck('eventName');

        $this->assertTrue($names->contains('Zilele Informaticii'));
        $this->assertFalse($names->contains('Workshop Design'));
    }
}
