<?php

declare(strict_types=1);

namespace Tests\Feature\Report;

use App\Jobs\GenerateReportJob;
use App\Models\Event;
use App\Models\Partner;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class ReportGenerationTest extends TestCase
{
    public function test_report_request_requires_selection_criteria(): void
    {
        $coordinator = $this->coordinator(['email' => 'report.val@e-uvt.ro', 'department' => 'Informatică']);

        $this->actingAsApi($coordinator)
            ->postJson('/api/generate-report', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['partner_ids']);
    }

    public function test_report_request_dispatches_generation_job(): void
    {
        Queue::fake();

        $coordinator = $this->coordinator(['email' => 'report.job@e-uvt.ro', 'department' => 'Informatică']);

        $event = Event::factory()->forCoordinator('report.job@e-uvt.ro', 'Informatică')->create();

        $this->actingAsApi($coordinator)
            ->postJson('/api/generate-report', [
                'event_ids' => [$event->id],
            ])
            ->assertAccepted()
            ->assertJsonPath('data.queued', true)
            ->assertJsonPath('data.report_type', 'normal');

        Queue::assertPushed(GenerateReportJob::class);
    }

    public function test_report_request_returns_422_when_no_events_match_scope(): void
    {
        $coordinator = $this->coordinator(['email' => 'report.empty@e-uvt.ro', 'department' => 'Informatică']);

        $foreign = Event::factory()->forCoordinator('other.report@e-uvt.ro', 'Informatică')->create();

        $this->actingAsApi($coordinator)
            ->postJson('/api/generate-report', [
                'event_ids' => [$foreign->id],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['event_ids']);
    }

    public function test_partner_ids_request_queues_partner_report_type(): void
    {
        Queue::fake();

        $coordinator = $this->coordinator([
            'email' => 'partner.report@e-uvt.ro',
            'department' => 'Informatică',
        ]);

        $partner = Partner::factory()->create();
        $event = Event::factory()->forCoordinator('partner.report@e-uvt.ro', 'Informatică')->create();
        $event->partners()->attach($partner->id);

        $this->actingAsApi($coordinator)
            ->postJson('/api/generate-report', ['partner_ids' => [$partner->id]])
            ->assertAccepted()
            ->assertJsonPath('data.report_type', 'partner');

        Queue::assertPushed(GenerateReportJob::class);
    }

    public function test_partner_ids_ignore_event_ids_in_request(): void
    {
        Queue::fake();

        $coordinator = $this->coordinator([
            'email' => 'partner.ignore@e-uvt.ro',
            'department' => 'Informatică',
        ]);

        $partner = Partner::factory()->create();
        $scoped = Event::factory()->forCoordinator('partner.ignore@e-uvt.ro', 'Informatică')->create();
        $scoped->partners()->attach($partner->id);

        $foreign = Event::factory()->forCoordinator('other.partner@e-uvt.ro', 'Informatică')->create();

        $this->actingAsApi($coordinator)
            ->postJson('/api/generate-report', [
                'partner_ids' => [$partner->id],
                'event_ids' => [$foreign->id],
            ])
            ->assertAccepted()
            ->assertJsonPath('data.report_type', 'partner');

        Queue::assertPushed(GenerateReportJob::class, function (GenerateReportJob $job) use ($partner): bool {
            return ($job->inputData['partner_ids'] ?? []) === [$partner->id];
        });
    }

    public function test_normal_report_preserves_event_ids_order_in_job_payload(): void
    {
        Queue::fake();

        $coordinator = $this->coordinator([
            'email' => 'report.order@e-uvt.ro',
            'department' => 'Informatică',
        ]);

        $first = Event::factory()->forCoordinator('report.order@e-uvt.ro', 'Informatică')->create();
        $second = Event::factory()->forCoordinator('report.order@e-uvt.ro', 'Informatică')->create();

        $this->actingAsApi($coordinator)
            ->postJson('/api/generate-report', [
                'event_ids' => [$second->id, $first->id],
            ])
            ->assertAccepted()
            ->assertJsonPath('data.report_type', 'normal');

        Queue::assertPushed(GenerateReportJob::class, function (GenerateReportJob $job) use ($first, $second): bool {
            return ($job->inputData['event_ids'] ?? []) === [$second->id, $first->id];
        });
    }
}
