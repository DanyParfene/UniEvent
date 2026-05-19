<?php

declare(strict_types=1);

namespace App\Services\Event;

use App\Enums\EventStatus;
use App\Models\Event;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;

final class EventListingQueryBuilder
{
    private const DEFAULT_SORT_BY = 'date';

    private const DEFAULT_SORT_DIRECTION = 'desc';

    private const ALLOWED_SORT_BY = ['date', 'name'];

    private const ALLOWED_SORT_DIRECTION = ['asc', 'desc'];

    public function __construct(
        private readonly EventVisibilityScope $visibilityScope,
    ) {}

    /**
     * @param  array<string, mixed>  $filters
     */
    public function paginate(User $user, array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = Event::query()->with(['metrics', 'partners']);

        $this->visibilityScope->apply(
            $query,
            $user,
            is_string($filters['department'] ?? null) ? $filters['department'] : null,
        );

        $this->applyArchivedScope($query, (bool) ($filters['archived'] ?? false));
        $this->applyUserFilters($query, $filters);
        $this->applySorting(
            $query,
            is_string($filters['sort_by'] ?? null) ? $filters['sort_by'] : null,
            is_string($filters['sort_direction'] ?? null) ? $filters['sort_direction'] : null,
        );

        $page = isset($filters['page']) ? (int) $filters['page'] : null;

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * @param  Builder<Event>  $query
     */
    private function applyArchivedScope(Builder $query, bool $archivedOnly): void
    {
        if ($archivedOnly) {
            $query->where('status', EventStatus::Archived);

            return;
        }

        $query->where('status', '!=', EventStatus::Archived);
    }

    /**
     * @param  Builder<Event>  $query
     * @param  array<string, mixed>  $filters
     */
    private function applyUserFilters(Builder $query, array $filters): void
    {
        if (isset($filters['name']) && is_string($filters['name']) && $filters['name'] !== '') {
            $escaped = str_replace(['%', '_'], ['\\%', '\\_'], $filters['name']);
            $query->where('name', 'like', '%'.$escaped.'%');
        }

        if (isset($filters['start_date'])) {
            $query->whereDate('start_date', '>=', $filters['start_date']);
        }

        if (isset($filters['end_date'])) {
            $query->whereDate('start_date', '<=', $filters['end_date']);
        }

        $partnerIds = Arr::wrap($filters['partners'] ?? []);
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

        $column = $sortBy === 'name' ? 'name' : 'start_date';

        $query->orderBy($column, $sortDirection);
    }
}
