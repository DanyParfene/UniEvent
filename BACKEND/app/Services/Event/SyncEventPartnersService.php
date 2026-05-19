<?php

declare(strict_types=1);

namespace App\Services\Event;

use App\Models\Event;

final class SyncEventPartnersService
{
    /**
     * @param  list<string>|null  $partnerIds
     */
    public function sync(Event $event, ?array $partnerIds): void
    {
        if ($partnerIds === null) {
            return;
        }

        $event->partners()->sync($partnerIds);
    }
}
