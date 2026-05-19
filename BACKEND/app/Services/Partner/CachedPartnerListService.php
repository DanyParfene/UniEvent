<?php

declare(strict_types=1);

namespace App\Services\Partner;

use App\Models\Partner;
use App\Support\CacheKeys;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

final class CachedPartnerListService
{
    /**
     * @return Collection<int, Partner>
     */
    public function allOrderedByName(): Collection
    {
        /** @var Collection<int, Partner> $partners */
        $partners = Cache::remember(
            CacheKeys::PARTNERS_LIST,
            now()->addHour(),
            static fn (): Collection => Partner::query()->orderBy('name')->get(),
        );

        return $partners;
    }
}
