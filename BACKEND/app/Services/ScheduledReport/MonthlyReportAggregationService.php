<?php

declare(strict_types=1);

namespace App\Services\ScheduledReport;

use App\Enums\EventStatus;
use App\Models\Event;
use App\Models\EventMetric;
use App\Models\User;
use App\Services\Event\EventVisibilityScope;
use App\Support\Event\SocialMetricCategories;
use App\Support\Report\MonthlyReportDataset;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;

final class MonthlyReportAggregationService
{
    public function __construct(
        private readonly EventVisibilityScope $visibilityScope,
    ) {}

    public function build(User $user, ?CarbonInterface $reference = null): MonthlyReportDataset
    {
        $reference ??= now();
        $monthStart = $reference->copy()->subMonth()->startOfMonth();
        $monthEnd = $reference->copy()->subMonth()->endOfMonth();
        $periodLabel = $monthStart->format('F Y');

        $scopedEventIds = Event::query()
            ->where('status', '!=', EventStatus::Archived)
            ->whereDate('start_event_date', '>=', $monthStart->toDateString())
            ->whereDate('start_event_date', '<=', $monthEnd->toDateString())
            ->tap(fn ($query) => $this->visibilityScope->apply($query, $user, null))
            ->pluck('id');

        $totalReach = (int) EventMetric::query()
            ->whereIn('event_id', $scopedEventIds)
            ->whereIn('category', SocialMetricCategories::values())
            ->sum('reach');

        $topEvents = $this->topEventsByReach($scopedEventIds);
        $departmentDistribution = $this->departmentDistribution($scopedEventIds);

        return new MonthlyReportDataset(
            reportTitle: 'Raport lunar centralizat — '.$periodLabel,
            periodLabel: $periodLabel,
            totalReach: $totalReach,
            topEvents: $topEvents,
            departmentDistribution: $departmentDistribution,
        );
    }

    /**
     * @param  \Illuminate\Support\Collection<int, string>  $scopedEventIds
     * @return list<array{name: string, reach: int}>
     */
    private function topEventsByReach($scopedEventIds): array
    {
        if ($scopedEventIds->isEmpty()) {
            return [];
        }

        return EventMetric::query()
            ->select('events.event_name', DB::raw('SUM(event_metrics.reach) as total_reach'))
            ->join('events', 'events.id', '=', 'event_metrics.event_id')
            ->whereIn('event_metrics.event_id', $scopedEventIds)
            ->whereIn('event_metrics.category', SocialMetricCategories::values())
            ->groupBy('events.id', 'events.event_name')
            ->orderByDesc('total_reach')
            ->limit(5)
            ->get()
            ->map(static fn ($row): array => [
                'name' => (string) $row->event_name,
                'reach' => (int) $row->total_reach,
            ])
            ->all();
    }

    /**
     * @param  \Illuminate\Support\Collection<int, string>  $scopedEventIds
     * @return list<array{department: string, count: int}>
     */
    private function departmentDistribution($scopedEventIds): array
    {
        if ($scopedEventIds->isEmpty()) {
            return [];
        }

        return Event::query()
            ->select('department', DB::raw('COUNT(*) as event_count'))
            ->whereIn('id', $scopedEventIds)
            ->groupBy('department')
            ->orderBy('department')
            ->get()
            ->map(static fn ($row): array => [
                'department' => (string) $row->department,
                'count' => (int) $row->event_count,
            ])
            ->all();
    }
}
