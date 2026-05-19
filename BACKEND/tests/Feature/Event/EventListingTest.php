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
        $coordinator = $this->coordinator(['email' => 'list@e-uvt.ro', 'department' => 'Informatică']);

        Event::factory()->forCoordinator('list@e-uvt.ro', 'Informatică')->create(['name' => 'Activ']);
        Event::factory()->forCoordinator('list@e-uvt.ro', 'Informatică')->archived()->create(['name' => 'Arhivat']);

        $response = $this->actingAsApi($coordinator)->getJson('/api/events');

        $response->assertOk();
        $names = collect($response->json('data'))->pluck('name');

        $this->assertTrue($names->contains('Activ'));
        $this->assertFalse($names->contains('Arhivat'));
    }

    public function test_archived_flag_returns_only_archived_events(): void
    {
        $coordinator = $this->coordinator(['email' => 'archived@e-uvt.ro', 'department' => 'Informatică']);

        Event::factory()->forCoordinator('archived@e-uvt.ro', 'Informatică')->create(['name' => 'Live']);
        Event::factory()->forCoordinator('archived@e-uvt.ro', 'Informatică')->archived()->create(['name' => 'Doar Arhivat']);

        $response = $this->actingAsApi($coordinator)->getJson('/api/events?archived=1');

        $response->assertOk();
        $names = collect($response->json('data'))->pluck('name');

        $this->assertFalse($names->contains('Live'));
        $this->assertTrue($names->contains('Doar Arhivat'));
    }

    public function test_coordinator_listing_is_scoped_to_own_events(): void
    {
        Event::factory()->forCoordinator('mine@e-uvt.ro', 'Informatică')->create(['name' => 'Al meu']);
        Event::factory()->forCoordinator('theirs@e-uvt.ro', 'Informatică')->create(['name' => 'Al altuia']);

        $coordinator = $this->coordinator(['email' => 'mine@e-uvt.ro', 'department' => 'Informatică']);

        $names = collect(
            $this->actingAsApi($coordinator)->getJson('/api/events')->json('data')
        )->pluck('name');

        $this->assertTrue($names->contains('Al meu'));
        $this->assertFalse($names->contains('Al altuia'));
    }

    public function test_department_administrator_sees_only_department_events(): void
    {
        Event::factory()->create([
            'department' => 'Informatică',
            'coordinator_email' => 'a@e-uvt.ro',
            'name' => 'Dept Informatică',
            'status' => EventStatus::Published->value,
        ]);
        Event::factory()->create([
            'department' => 'Matematică',
            'coordinator_email' => 'b@e-uvt.ro',
            'name' => 'Dept Matematică',
            'status' => EventStatus::Published->value,
        ]);

        $admin = $this->departmentAdmin(['department' => 'Informatică']);

        $names = collect(
            $this->actingAsApi($admin)->getJson('/api/events')->json('data')
        )->pluck('name');

        $this->assertTrue($names->contains('Dept Informatică'));
        $this->assertFalse($names->contains('Dept Matematică'));
    }

    public function test_name_filter_matches_partial_event_names(): void
    {
        $coordinator = $this->coordinator(['email' => 'filter@e-uvt.ro', 'department' => 'Informatică']);

        Event::factory()->forCoordinator('filter@e-uvt.ro', 'Informatică')->create(['name' => 'Zilele Informaticii']);
        Event::factory()->forCoordinator('filter@e-uvt.ro', 'Informatică')->create(['name' => 'Workshop Design']);

        $names = collect(
            $this->actingAsApi($coordinator)
                ->getJson('/api/events?name=Informatic')
                ->json('data')
        )->pluck('name');

        $this->assertTrue($names->contains('Zilele Informaticii'));
        $this->assertFalse($names->contains('Workshop Design'));
    }
}
