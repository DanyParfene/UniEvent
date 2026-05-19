<?php

declare(strict_types=1);

namespace App\Services\Cache;

use App\Support\CacheKeys;
use Illuminate\Support\Facades\Cache;

final class ReferenceDataCacheInvalidator
{
    public function forgetPartnersList(): void
    {
        Cache::forget(CacheKeys::PARTNERS_LIST);
    }

    public function forgetStatisticsDashboards(): void
    {
        Cache::tags(['statistics'])->flush();
    }

    public function forgetAll(): void
    {
        $this->forgetPartnersList();
        $this->forgetStatisticsDashboards();
    }
}
