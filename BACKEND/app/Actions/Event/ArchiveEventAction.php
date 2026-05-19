<?php

declare(strict_types=1);

namespace App\Actions\Event;

use App\Enums\EventStatus;
use App\Models\Event;
use App\Services\Cache\ReferenceDataCacheInvalidator;

final class ArchiveEventAction
{
    public function __construct(
        private readonly ReferenceDataCacheInvalidator $cacheInvalidator,
    ) {}

    public function execute(Event $event): Event
    {
        $event->update(['status' => EventStatus::Archived]);

        $this->cacheInvalidator->forgetStatisticsDashboards();

        return $event->fresh(['metrics', 'partners']);
    }
}
