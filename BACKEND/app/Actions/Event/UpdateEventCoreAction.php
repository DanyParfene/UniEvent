<?php

declare(strict_types=1);

namespace App\Actions\Event;

use App\Models\Event;
use App\Models\User;
use App\Services\Cache\ReferenceDataCacheInvalidator;
use App\Services\Event\EventDepartmentResolver;
use App\Services\Event\SyncEventPartnersService;
use Illuminate\Support\Arr;

final class UpdateEventCoreAction
{
    public function __construct(
        private readonly EventDepartmentResolver $departmentResolver,
        private readonly SyncEventPartnersService $partnerSync,
        private readonly ReferenceDataCacheInvalidator $cacheInvalidator,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(User $user, Event $event, array $data): Event
    {
        $payload = Arr::except($data, ['partner_ids', 'department']);

        if (array_key_exists('department', $data)) {
            $payload['department'] = $this->departmentResolver->resolveForUpdate(
                $user,
                $event,
                $data['department'],
            );
        }

        $event->update($payload);

        if (array_key_exists('partner_ids', $data)) {
            $this->partnerSync->sync($event, $data['partner_ids']);
        }

        $this->cacheInvalidator->forgetStatisticsDashboards();

        return $event->fresh(['metrics', 'partners']);
    }
}
