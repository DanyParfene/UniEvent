<?php

declare(strict_types=1);

namespace App\Services\Report;

use App\Models\Event;
use Illuminate\Support\Collection;

final class ReportEventOrderer
{
    /**
     * Preserve the incoming event_ids order for normal reports.
     *
     * @param  list<string>  $orderedIds
     * @param  Collection<int, Event>  $events
     * @return list<Event>
     */
    public function orderByIds(array $orderedIds, Collection $events): array
    {
        $byId = $events->keyBy('id');
        $ordered = [];

        foreach ($orderedIds as $id) {
            $event = $byId->get($id);

            if ($event instanceof Event) {
                $ordered[] = $event;
            }
        }

        return $ordered;
    }
}
