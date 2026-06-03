<?php

declare(strict_types=1);

namespace App\Actions\Statistics;

use App\Models\Partner;
use Illuminate\Support\Collection;

final class GetTopPartnersAction
{
    /**
     * @return Collection<int, Partner>
     */
    public function execute(int $limit = 3): Collection
    {
        return Partner::query()
            ->withCount('events')
            ->orderByDesc('events_count')
            ->limit($limit)
            ->get();
    }
}
