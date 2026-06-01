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
     * Returns partners scoped by department.
     *
     * - null  → no filter (super admin global view): all active partners
     * - string → only partners matching that department OR with null department (UVT-wide)
     *
     * Results are cached per department key under the partners-list tag so that
     * a single Cache::tags(['partners-list'])->flush() invalidates all variants.
     *
     * @return Collection<int, Partner>
     */
    public function forDepartment(?string $department): Collection
    {
        $cacheKey = CacheKeys::partnersList($department);

        /** @var Collection<int, Partner> $partners */
        $partners = Cache::tags([CacheKeys::PARTNERS_LIST_TAG])->remember(
            $cacheKey,
            now()->addHour(),
            function () use ($department): Collection {
                $query = Partner::query()->orderBy('name');

                if ($department !== null) {
                    $query->where(function ($q) use ($department): void {
                        $q->where('department', $department)
                            ->orWhereNull('department');
                    });
                }

                return $query->get();
            },
        );

        return $partners;
    }
}
