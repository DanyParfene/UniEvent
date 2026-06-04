<?php

declare(strict_types=1);

namespace App\Actions\Event;

use App\Enums\EventStatus;
use App\Models\Event;

final class ArchiveEventAction
{
    public function execute(Event $event): Event
    {
        $event->update(['status' => EventStatus::Archived]);

        return $event->fresh(['metrics', 'partners']);
    }
}
