<?php

declare(strict_types=1);

namespace App\Services\Cache;

use App\Support\CacheKeys;
use Illuminate\Support\Facades\Cache;

final class ReferenceDataCacheInvalidator
{
    public function forgetPartnersList(): void
    {
        Cache::tags([CacheKeys::PARTNERS_LIST_TAG])->flush();
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
