<?php

declare(strict_types=1);

namespace App\Services\Statistics;

use App\Enums\EventMetricCategory;
use App\Models\EventMetric;
use App\Models\Partner;
use App\Models\User;
use App\Support\RomanianMonthShortLabel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

final class StatisticsDashboardService
{
    public function __construct(
        private readonly StatisticsScopedEventQuery $scopedEventQuery,
    ) {}

    /**
     * @return array{
     *   best_partner: ?Partner,
     *   last_month_press_aparitions: int,
     *   next_5_events: array<int, array{name: string, id: string}>|string,
     *   best_organizator: ?string,
     *   most_participants: int,
     *   number_of_events_per_month: array<int, array{month: string, count: int}>
     * }
     */
    public function compute(User $user, ?string $department = null): array
    {
        return [
            'best_partner' => $this->resolveBestPartner($user, $department),
            'last_month_press_aparitions' => $this->countPressAppearances($user, $department),
            'next_5_events' => $this->resolveNextFiveEvents($user, $department),
            'best_organizator' => $this->resolveBestOrganizer($user, $department),
            'most_participants' => $this->resolveMostParticipants($user, $department),
            'number_of_events_per_month' => $this->resolveEventsPerMonth($user, $department),
        ];
    }

    private function resolveBestPartner(User $user, ?string $department): ?Partner
    {
        $windowStart = now()->subDays(30)->toDateString();

        $partnerId = DB::table('event_partners')
            ->join('events', 'events.id', '=', 'event_partners.event_id')
            ->whereDate('events.start_date', '>=', $windowStart)
            ->where('events.status', '!=', 'archived')
            ->whereIn('events.id', $this->scopedEventIdsSubquery($user, $department))
            ->groupBy('event_partners.partner_id')
            ->orderByRaw('COUNT(*) DESC')
            ->orderBy('event_partners.partner_id')
            ->value('event_partners.partner_id');

        if ($partnerId === null) {
            return null;
        }

        return Partner::withTrashed()->find($partnerId);
    }

    private function countPressAppearances(User $user, ?string $department): int
    {
        $yearStart = now()->subYear()->toDateString();

        return EventMetric::query()
            ->where('category', EventMetricCategory::AparitiiPresa)
            ->whereIn('event_id', $this->scopedEventQuery->forUser($user, $department)
                ->whereDate('start_date', '>=', $yearStart)
                ->select('id'))
            ->count();
    }

    /**
     * @return array<int, array{name: string, id: string}>|string
     */
    private function resolveNextFiveEvents(User $user, ?string $department): array|string
    {
        $events = $this->scopedEventQuery->forUser($user, $department)
            ->whereDate('start_date', '>=', now()->toDateString())
            ->orderBy('start_date')
            ->orderBy('name')
            ->limit(5)
            ->get(['id', 'name']);

        if ($events->isEmpty()) {
            return '';
        }

        return $events
            ->map(fn ($event) => ['id' => $event->id, 'name' => $event->name])
            ->values()
            ->all();
    }

    private function resolveBestOrganizer(User $user, ?string $department): ?string
    {
        $yearStart = now()->subYear()->toDateString();

        return $this->scopedEventQuery->forUser($user, $department)
            ->whereDate('start_date', '>=', $yearStart)
            ->select('organizer')
            ->groupBy('organizer')
            ->orderByRaw('COUNT(*) DESC')
            ->orderBy('organizer')
            ->value('organizer');
    }

    private function resolveMostParticipants(User $user, ?string $department): int
    {
        $yearStart = now()->subYear()->toDateString();

        $max = $this->scopedEventQuery->forUser($user, $department)
            ->whereDate('start_date', '>=', $yearStart)
            ->max('estimated_participants');

        return (int) ($max ?? 0);
    }

    /**
     * @return array<int, array{month: string, count: int}>
     */
    private function resolveEventsPerMonth(User $user, ?string $department): array
    {
        $currentYear = now()->year;
        $currentMonth = now()->month;

        $counts = $this->scopedEventQuery->forUser($user, $department)
            ->whereYear('start_date', $currentYear)
            ->selectRaw('MONTH(start_date) as month_number, COUNT(*) as event_count')
            ->groupBy('month_number')
            ->pluck('event_count', 'month_number');

        $result = [];

        for ($month = 1; $month <= $currentMonth; $month++) {
            $result[] = [
                'month' => RomanianMonthShortLabel::for($month),
                'count' => (int) ($counts[$month] ?? 0),
            ];
        }

        return $result;
    }

    /**
     * @return Builder<\App\Models\Event>
     */
    private function scopedEventIdsSubquery(User $user, ?string $department): Builder
    {
        return $this->scopedEventQuery->forUser($user, $department)->select('id');
    }
}
