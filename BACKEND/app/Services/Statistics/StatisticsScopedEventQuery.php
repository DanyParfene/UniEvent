<?php

declare(strict_types=1);

namespace App\Services\Statistics;

use App\Enums\EventStatus;
use App\Models\Event;
use App\Services\Event\EventVisibilityScope;
use App\Support\Contracts\AuthenticatedUser;
use Illuminate\Database\Eloquent\Builder;

/**
 * Builds RBAC-scoped event queries for dashboard statistics (excludes archived).
 */
final class StatisticsScopedEventQuery
{
    public function __construct(
        private readonly EventVisibilityScope $visibilityScope,
    ) {}

    /**
     * @return Builder<Event>
     */
    public function forUser(AuthenticatedUser $user, ?string $requestedDepartment = null): Builder
    {
        $query = Event::query();

        $this->visibilityScope->apply($query, $user, $requestedDepartment);

        $query->where('status', '!=', EventStatus::Archived);

        return $query;
    }
}
