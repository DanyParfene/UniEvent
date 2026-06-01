<?php

declare(strict_types=1);

namespace App\Actions\Event;

use App\Models\Event;
use App\Services\Cache\ReferenceDataCacheInvalidator;
use App\Support\Contracts\AuthenticatedUser;
use App\Services\Event\EventDepartmentResolver;
use App\Services\Event\SyncEventPartnersService;
use Illuminate\Support\Arr;

final class CreateEventAction
{
    public function __construct(
        private readonly EventDepartmentResolver $departmentResolver,
        private readonly SyncEventPartnersService $partnerSync,
        private readonly ReferenceDataCacheInvalidator $cacheInvalidator,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(AuthenticatedUser $user, array $data): Event
    {
        $department = $this->departmentResolver->resolveForCreate(
            $user,
            $data['department'] ?? null,
        );

        $event = Event::query()->create([
            ...Arr::except($data, ['partner_ids', 'department']),
            'department' => $department,
        ]);

        $this->partnerSync->sync($event, $data['partner_ids'] ?? null);

        $this->cacheInvalidator->forgetStatisticsDashboards();

        return $event->load(['metrics', 'partners']);
    }
}
