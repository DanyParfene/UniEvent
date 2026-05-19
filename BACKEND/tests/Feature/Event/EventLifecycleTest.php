<?php

declare(strict_types=1);

namespace Tests\Feature\Event;

use App\Enums\EventMetricCategory;
use App\Enums\EventStatus;
use App\Models\Event;
use Tests\TestCase;

class EventLifecycleTest extends TestCase
{
    public function test_coordinator_can_create_show_and_update_event(): void
    {
        $coordinator = $this->coordinator([
            'email' => 'owner@e-uvt.ro',
            'department' => 'Informatică',
        ]);

        $payload = $this->validEventPayload([
            'coordinator_email' => 'owner@e-uvt.ro',
            'name' => 'Eveniment Inițial',
        ]);

        $create = $this->actingAsApi($coordinator)
            ->postJson('/api/event', $payload);

        $create->assertCreated()
            ->assertJsonPath('data.name', 'Eveniment Inițial');

        $eventId = $create->json('data.id');

        $this->actingAsApi($coordinator)
            ->getJson("/api/event/{$eventId}")
            ->assertOk()
            ->assertJsonPath('data.id', $eventId);

        $this->actingAsApi($coordinator)
            ->putJson("/api/event/{$eventId}", [
                'name' => 'Eveniment Actualizat',
                'description' => 'Descriere actualizată.',
            ])
            ->assertOk()
            ->assertJsonPath('data.name', 'Eveniment Actualizat');
    }

    public function test_metrics_update_upserts_by_category(): void
    {
        $coordinator = $this->coordinator(['email' => 'metrics@e-uvt.ro', 'department' => 'Informatică']);

        $eventId = $this->actingAsApi($coordinator)
            ->postJson('/api/event', $this->validEventPayload([
                'coordinator_email' => 'metrics@e-uvt.ro',
            ]))
            ->json('data.id');

        $metrics = [
            [
                'category' => EventMetricCategory::Facebook->value,
                'link' => 'https://facebook.com/post/1',
                'reach' => 100,
                'engagement' => 10,
            ],
        ];

        $this->actingAsApi($coordinator)
            ->putJson("/api/event/{$eventId}", ['metrics' => $metrics])
            ->assertOk()
            ->assertJsonPath('data.metrics.0.reach', 100);

        $metrics[0]['reach'] = 250;

        $this->actingAsApi($coordinator)
            ->putJson("/api/event/{$eventId}", ['metrics' => $metrics])
            ->assertOk()
            ->assertJsonPath('data.metrics.0.reach', 250);

        $this->assertDatabaseCount('event_metrics', 1);
    }

    public function test_archive_marks_event_as_archived(): void
    {
        $coordinator = $this->coordinator(['email' => 'archive@e-uvt.ro', 'department' => 'Informatică']);

        $eventId = $this->actingAsApi($coordinator)
            ->postJson('/api/event', $this->validEventPayload([
                'coordinator_email' => 'archive@e-uvt.ro',
            ]))
            ->json('data.id');

        $this->actingAsApi($coordinator)
            ->putJson("/api/event/{$eventId}", ['archive' => true])
            ->assertOk()
            ->assertJsonPath('data.status', EventStatus::Archived->value);
    }

    public function test_coordinator_cannot_view_another_coordinators_event(): void
    {
        $owner = $this->coordinator(['email' => 'owner.only@e-uvt.ro']);
        $intruder = $this->coordinator(['email' => 'other.coord@e-uvt.ro']);

        $event = Event::factory()->forCoordinator('owner.only@e-uvt.ro', 'Informatică')->create();

        $this->actingAsApi($intruder)
            ->getJson("/api/event/{$event->id}")
            ->assertForbidden();
    }
}
