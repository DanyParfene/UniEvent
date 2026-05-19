<?php

declare(strict_types=1);

namespace App\Actions\Event;

use App\Enums\EventMetricCategory;
use App\Models\Event;
use App\Services\Cache\ReferenceDataCacheInvalidator;
use Illuminate\Support\Facades\DB;

final class UpdateEventMetricsAction
{
    public function __construct(
        private readonly ReferenceDataCacheInvalidator $cacheInvalidator,
    ) {}

    /**
     * Upserts metrics by (event_id, category) to avoid duplicate rows.
     *
     * @param  list<array{category: string, link: string, reach: int, engagement: int}>  $metrics
     */
    public function execute(Event $event, array $metrics): Event
    {
        DB::transaction(function () use ($event, $metrics): void {
            foreach ($metrics as $row) {
                $category = EventMetricCategory::from($row['category']);

                $event->metrics()->updateOrCreate(
                    ['category' => $category],
                    [
                        'link' => $row['link'],
                        'reach' => (int) $row['reach'],
                        'engagement' => (int) $row['engagement'],
                    ],
                );
            }
        });

        $this->cacheInvalidator->forgetStatisticsDashboards();

        return $event->fresh(['metrics', 'partners']);
    }
}
