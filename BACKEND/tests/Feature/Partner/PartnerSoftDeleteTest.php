<?php

declare(strict_types=1);

namespace Tests\Feature\Partner;

use App\Models\Partner;
use Tests\Concerns\BuildsEventPayload;
use Tests\TestCase;

class PartnerSoftDeleteTest extends TestCase
{
    use BuildsEventPayload;

    public function test_deleted_partner_is_hidden_from_partner_list(): void
    {
        $admin = $this->departmentAdmin();
        $partner = Partner::factory()->create(['name' => 'To Remove']);

        $this->actingAsApi($admin)
            ->deleteJson("/api/partners/{$partner->id}")
            ->assertNoContent();

        $this->actingAsApi($admin)
            ->getJson('/api/partners')
            ->assertOk()
            ->assertJsonMissing(['id' => $partner->id]);
    }

    public function test_deleted_partner_remains_on_linked_event_detail(): void
    {
        $coordinator = $this->coordinator(['email' => 'coord.partner@e-uvt.ro']);
        $admin = $this->departmentAdmin();
        $partner = Partner::factory()->create(['name' => 'Historical Partner']);

        $payload = $this->validEventPayload([
            'coordinator_email' => $coordinator->email,
            'partner_ids' => [$partner->id],
        ]);

        $createResponse = $this->actingAsApi($coordinator)
            ->postJson('/api/event', $payload)
            ->assertCreated();

        $eventId = $createResponse->json('data.id');

        $this->actingAsApi($admin)
            ->deleteJson("/api/partners/{$partner->id}")
            ->assertNoContent();

        $this->actingAsApi($coordinator)
            ->getJson("/api/event/{$eventId}")
            ->assertOk()
            ->assertJsonPath('data.partners.0.name', 'Historical Partner');
    }

    public function test_cannot_assign_soft_deleted_partner_to_new_event(): void
    {
        $coordinator = $this->coordinator();
        $admin = $this->departmentAdmin();
        $partner = Partner::factory()->create();

        $this->actingAsApi($admin)
            ->deleteJson("/api/partners/{$partner->id}")
            ->assertNoContent();

        $payload = $this->validEventPayload([
            'coordinator_email' => $coordinator->email,
            'partner_ids' => [$partner->id],
        ]);

        $this->actingAsApi($coordinator)
            ->postJson('/api/event', $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['partner_ids.0']);
    }

    public function test_coordinator_cannot_delete_partners(): void
    {
        $coordinator = $this->coordinator();
        $partner = Partner::factory()->create();

        $this->actingAsApi($coordinator)
            ->deleteJson("/api/partners/{$partner->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('partners', [
            'id' => $partner->id,
            'deleted_at' => null,
        ]);
    }

    public function test_super_administrator_can_delete_partners(): void
    {
        $superAdmin = $this->superAdmin();
        $partner = Partner::factory()->create();

        $this->actingAsApi($superAdmin)
            ->deleteJson("/api/partners/{$partner->id}")
            ->assertNoContent();

        $this->assertSoftDeleted('partners', ['id' => $partner->id]);
    }
}
