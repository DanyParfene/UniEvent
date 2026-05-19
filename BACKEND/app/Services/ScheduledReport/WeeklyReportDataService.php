<?php

declare(strict_types=1);

namespace App\Services\ScheduledReport;

use App\Enums\EventStatus;
use App\Models\Event;
use App\Models\User;
use App\Services\Event\EventVisibilityScope;
use App\Support\Event\SocialMetricCategories;
use App\Support\Report\WeeklyReportDataset;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;

final class WeeklyReportDataService
{
    public function __construct(
        private readonly EventVisibilityScope $visibilityScope,
    ) {}

    public function build(User $user, ?CarbonInterface $reference = null): WeeklyReportDataset
    {
        $reference ??= now();
        $pastWeekStart = $reference->copy()->subWeek()->startOfWeek();
        $pastWeekEnd = $reference->copy()->subWeek()->endOfWeek();
        $nextWeekStart = $reference->copy()->addWeek()->startOfWeek();
        $nextWeekEnd = $reference->copy()->addWeek()->endOfWeek();

        $periodLabel = sprintf(
            '%s – %s',
            $pastWeekStart->format('d.m.Y'),
            $pastWeekEnd->format('d.m.Y'),
        );

        return new WeeklyReportDataset(
            reportTitle: 'Raport săptămânal '.$periodLabel,
            periodLabel: $periodLabel,
            pastWeekEvents: $this->eventsInRange($user, $pastWeekStart, $pastWeekEnd)->get()->all(),
            incompleteEvents: $this->incompleteEvents($user, $reference)->get()->all(),
            nextWeekEvents: $this->eventsInRange($user, $nextWeekStart, $nextWeekEnd)->get()->all(),
            socialImpact: $this->socialImpactRows($user, $pastWeekStart, $pastWeekEnd),
        );
    }

    /**
     * @return Builder<Event>
     */
    private function eventsInRange(User $user, CarbonInterface $start, CarbonInterface $end): Builder
    {
        $query = $this->scopedBase($user);

        $query->whereDate('start_date', '>=', $start->toDateString())
            ->whereDate('start_date', '<=', $end->toDateString())
            ->orderBy('start_date');

        return $query;
    }

    /**
     * @return Builder<Event>
     */
    private function incompleteEvents(User $user, CarbonInterface $reference): Builder
    {
        $query = $this->scopedBase($user);

        $query->whereDate('finish_date', '<', $reference->toDateString())
            ->whereDoesntHave('metrics', function (Builder $metricQuery): void {
                $metricQuery->whereIn('category', SocialMetricCategories::values());
            })
            ->orderBy('finish_date', 'desc');

        return $query;
    }

    /**
     * @return list<array{event: Event, total_reach: int}>
     */
    private function socialImpactRows(
        User $user,
        CarbonInterface $start,
        CarbonInterface $end,
    ): array {
        $events = $this->eventsInRange($user, $start, $end)
            ->whereHas('metrics', function (Builder $metricQuery): void {
                $metricQuery->whereIn('category', SocialMetricCategories::values());
            })
            ->get();

        $rows = [];

        foreach ($events as $event) {
            $totalReach = (int) $event->metrics
                ->filter(static fn ($metric): bool => in_array(
                    $metric->category,
                    SocialMetricCategories::cases(),
                    true,
                ))
                ->sum('reach');

            $rows[] = [
                'event' => $event,
                'total_reach' => $totalReach,
            ];
        }

        usort($rows, static fn (array $a, array $b): int => $b['total_reach'] <=> $a['total_reach']);

        return $rows;
    }

    /**
     * @return Builder<Event>
     */
    private function scopedBase(User $user): Builder
    {
        $query = Event::query()
            ->with(['metrics', 'partners'])
            ->where('status', '!=', EventStatus::Archived);

        $this->visibilityScope->apply($query, $user, null);

        return $query;
    }
}
