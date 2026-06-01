<?php

declare(strict_types=1);

namespace App\Services\Reminder;

use App\Enums\EventStatus;
use App\Models\Event;
use App\Support\Event\SocialMetricCategories;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

final class EventReminderQueryService
{
    /**
     * @return Collection<int, Event>
     */
    public function preEventTargets(CarbonInterface $today): Collection
    {
        $targetDate = $today->copy()->addDays(7)->toDateString();

        return $this->baseQuery()
            ->whereDate('start_event_date', $targetDate)
            ->whereNotNull('email')
            ->where('email', '!=', '')
            ->get();
    }

    /**
     * @return Collection<int, Event>
     */
    public function postEventTargets(CarbonInterface $today): Collection
    {
        $targetDate = $today->copy()->subDays(2)->toDateString();

        return $this->eventsEndedWithoutSocialMetrics($targetDate);
    }

    /**
     * @return Collection<int, Event>
     */
    public function ultimatumTargets(CarbonInterface $today): Collection
    {
        $targetDate = $today->copy()->subDays(7)->toDateString();

        return $this->eventsEndedWithoutSocialMetrics($targetDate);
    }

    /**
     * @return Collection<int, Event>
     */
    private function eventsEndedWithoutSocialMetrics(string $finishDate): Collection
    {
        return $this->baseQuery()
            ->whereDate('finish_event_date', $finishDate)
            ->whereNotNull('email')
            ->where('email', '!=', '')
            ->whereDoesntHave('metrics', function (Builder $query): void {
                $query->whereIn('category', SocialMetricCategories::values());
            })
            ->get();
    }

    /**
     * @return Builder<Event>
     */
    private function baseQuery(): Builder
    {
        return Event::query()
            ->where('status', '!=', EventStatus::Archived);
    }
}
