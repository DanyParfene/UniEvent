<?php

declare(strict_types=1);

namespace App\Actions\Event;

use App\Services\Event\EventListingQueryBuilder;
use App\Support\Contracts\AuthenticatedUser;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListEventsAction
{
    public function __construct(
        private readonly EventListingQueryBuilder $listingQuery,
    ) {}

    /**
     * @param  array<string, mixed>  $filters
     */
    public function execute(AuthenticatedUser $user, array $filters): LengthAwarePaginator
    {
        return $this->listingQuery->paginate($user, $filters);
    }
}
