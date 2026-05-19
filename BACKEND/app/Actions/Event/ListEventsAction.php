<?php

declare(strict_types=1);

namespace App\Actions\Event;

use App\Models\User;
use App\Services\Event\EventListingQueryBuilder;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListEventsAction
{
    public function __construct(
        private readonly EventListingQueryBuilder $listingQuery,
    ) {}

    /**
     * @param  array<string, mixed>  $filters
     */
    public function execute(User $user, array $filters): LengthAwarePaginator
    {
        return $this->listingQuery->paginate($user, $filters);
    }
}
