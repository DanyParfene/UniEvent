<?php

declare(strict_types=1);

namespace Tests\Feature\Statistics;

use App\Enums\EventMetricCategory;
use App\Models\Event;
use App\Models\EventMetric;
use Tests\TestCase;

class StatisticsDashboardTest extends TestCase
{
    public function test_statistics_endpoint_returns_expected_fields(): void
    {
        $coordinator = $this->coordinator(['email' => 'stats@e-uvt.ro', 'department' => 'Informatică']);

        $response = $this->actingAsApi($coordinator)->getJson('/api/statistics');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'best_partner',
                    'last_month_press_aparitions',
                    'next_5_events',
                    'best_organizator',
                    'most_participants',
                    'number_of_events_per_month',
                ],
            ]);
    }

    public function test_press_appearances_count_is_scoped_to_visible_events(): void
    {
        $coordinator = $this->coordinator(['email' => 'press@e-uvt.ro', 'department' => 'Informatică']);

        $visible = Event::factory()->forCoordinator('press@e-uvt.ro', 'Informatică')->create([
            'start_date' => now()->subMonths(2)->toDateString(),
            'estimated_participants' => 80,
        ]);
        EventMetric::query()->create([
            'event_id' => $visible->id,
            'category' => EventMetricCategory::AparitiiPresa,
            'link' => 'https://press.example/article',
            'reach' => 0,
            'engagement' => 0,
        ]);

        $hidden = Event::factory()->forCoordinator('other.press@e-uvt.ro', 'Informatică')->create([
            'start_date' => now()->subMonths(2)->toDateString(),
        ]);
        EventMetric::query()->create([
            'event_id' => $hidden->id,
            'category' => EventMetricCategory::AparitiiPresa,
            'link' => 'https://press.example/other',
            'reach' => 0,
            'engagement' => 0,
        ]);

        $count = $this->actingAsApi($coordinator)
            ->getJson('/api/statistics')
            ->json('data.last_month_press_aparitions');

        $this->assertSame(1, $count);
    }

    public function test_most_participants_reflects_scoped_events_in_past_year(): void
    {
        $coordinator = $this->coordinator(['email' => 'participants@e-uvt.ro', 'department' => 'Informatică']);

        Event::factory()->forCoordinator('participants@e-uvt.ro', 'Informatică')->create([
            'start_date' => now()->subMonth()->toDateString(),
            'estimated_participants' => 150,
        ]);
        Event::factory()->forCoordinator('other.participants@e-uvt.ro', 'Informatică')->create([
            'start_date' => now()->subMonth()->toDateString(),
            'estimated_participants' => 900,
        ]);

        $most = $this->actingAsApi($coordinator)
            ->getJson('/api/statistics')
            ->json('data.most_participants');

        $this->assertSame(150, $most);
    }
}
