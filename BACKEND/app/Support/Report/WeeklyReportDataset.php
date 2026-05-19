<?php

declare(strict_types=1);

namespace App\Support\Report;

use App\Models\Event;

final readonly class WeeklyReportDataset
{
    /**
     * @param  list<Event>  $pastWeekEvents
     * @param  list<Event>  $incompleteEvents
     * @param  list<Event>  $nextWeekEvents
     * @param  list<array{event: Event, total_reach: int}>  $socialImpact
     */
    public function __construct(
        public string $reportTitle,
        public string $periodLabel,
        public array $pastWeekEvents,
        public array $incompleteEvents,
        public array $nextWeekEvents,
        public array $socialImpact,
    ) {}

    public function hasContent(): bool
    {
        return $this->pastWeekEvents !== []
            || $this->incompleteEvents !== []
            || $this->nextWeekEvents !== []
            || $this->socialImpact !== [];
    }
}
