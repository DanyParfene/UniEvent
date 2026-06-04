<?php

declare(strict_types=1);

namespace App\Actions\Event;

use App\Enums\EventMetricCategory;
use App\Models\Event;
use Illuminate\Support\Facades\DB;

final class UpdateEventMetricsAction
{
    /**
     * Replaces all metrics for the event with the incoming set.
     * Allows multiple rows per category (e.g. several aparitii_presa links).
     *
     * @param  list<array{category: string, link: string, reach: int, engagement: int}>  $metrics
     */
    public function execute(Event $event, array $metrics): Event
    {
        DB::transaction(function () use ($event, $metrics): void {
            $event->metrics()->delete();

            foreach ($metrics as $row) {
                $event->metrics()->create([
                    'category' => EventMetricCategory::from($row['category']),
                    'link' => $row['link'],
                    'reach' => (int) $row['reach'],
                    'engagement' => (int) $row['engagement'],
                ]);
            }
        });

        return $event->fresh(['metrics', 'partners']);
    }
}
