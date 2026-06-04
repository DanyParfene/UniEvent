<?php

declare(strict_types=1);

namespace App\Services\Report;

use App\Enums\EventStatus;
use App\Models\Event;
use App\Services\Event\EventVisibilityScope;
use App\Support\Contracts\AuthenticatedUser;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;

/**
 * Scoped event query for reports (reuses listing filters without pagination).
 */
final class ReportEventScopeQuery
{
    private const DEFAULT_SORT_BY = 'date';

    private const DEFAULT_SORT_DIRECTION = 'desc';

    private const ALLOWED_SORT_BY = ['date', 'name'];

    private const ALLOWED_SORT_DIRECTION = ['asc', 'desc'];

    public function __construct(
        private readonly EventVisibilityScope $visibilityScope,
    ) {}

    /**
     * @param  array<string, mixed>  $filterParams
     * @return Builder<Event>
     */
    public function baseQuery(AuthenticatedUser $user, array $filterParams): Builder
    {
        $query = Event::query()->with(['metrics', 'partners']);

        $this->visibilityScope->apply(
            $query,
            $user,
            is_string($filterParams['department'] ?? null) ? $filterParams['department'] : null,
        );

        $query->where('status', '!=', EventStatus::Archived);
        $this->applyFilters($query, $filterParams);
        $this->applySorting(
            $query,
            is_string($filterParams['sort_by'] ?? null) ? $filterParams['sort_by'] : null,
            is_string($filterParams['sort_direction'] ?? null) ? $filterParams['sort_direction'] : null,
        );

        return $query;
    }

    /**
     * @param  Builder<Event>  $query
     * @param  array<string, mixed>  $filterParams
     */
    private function applyFilters(Builder $query, array $filterParams): void
    {
        if (isset($filterParams['name']) && is_string($filterParams['name']) && $filterParams['name'] !== '') {
            $escaped = str_replace(['%', '_'], ['\\%', '\\_'], $filterParams['name']);
            $query->where('event_name', 'like', '%'.$escaped.'%');
        }

        if (isset($filterParams['start_date'])) {
            $query->whereDate('start_event_date', '>=', $filterParams['start_date']);
        }

        if (isset($filterParams['end_date'])) {
            $query->whereDate('start_event_date', '<=', $filterParams['end_date']);
        }

        $partnerIds = Arr::wrap($filterParams['partners'] ?? []);
        $partnerIds = array_values(array_filter($partnerIds, fn ($id) => is_string($id) && $id !== ''));

        if ($partnerIds !== []) {
            $query->whereHas('partners', function (Builder $partnerQuery) use ($partnerIds): void {
                $partnerQuery->whereIn('partners.id', $partnerIds);
            });
        }
    }

    /**
     * @param  Builder<Event>  $query
     */
    private function applySorting(Builder $query, ?string $sortBy, ?string $sortDirection): void
    {
        $sortBy = in_array($sortBy, self::ALLOWED_SORT_BY, true)
            ? $sortBy
            : self::DEFAULT_SORT_BY;

        $sortDirection = in_array($sortDirection, self::ALLOWED_SORT_DIRECTION, true)
            ? $sortDirection
            : self::DEFAULT_SORT_DIRECTION;

        $column = $sortBy === 'name' ? 'event_name' : 'start_event_date';

        $query->orderBy($column, $sortDirection);
    }

    /**
     * @param  list<string>  $partnerIds
     * @param  array<string, mixed>  $filterParams
     */
    public function forPartner(AuthenticatedUser $user, string $partnerId, array $filterParams): Builder
    {
        $query = $this->baseQuery($user, $filterParams);

        $query->whereHas('partners', function (Builder $partnerQuery) use ($partnerId): void {
            $partnerQuery->where('partners.id', $partnerId);
        });

        return $query;
    }

    /**
     * @param  list<string>  $eventIds
     * @return Builder<Event>
     */
    public function forEventIds(AuthenticatedUser $user, array $eventIds): Builder
    {
        $query = Event::query()->with(['metrics', 'partners']);

        $this->visibilityScope->apply($query, $user, null);
        $query->where('status', '!=', EventStatus::Archived);
        $query->whereIn('id', $eventIds);

        return $query;
    }
}
