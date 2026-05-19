<?php

declare(strict_types=1);

namespace App\Actions\Partner;

use App\Models\Partner;
use App\Services\Cache\ReferenceDataCacheInvalidator;

final class DeletePartnerAction
{
    public function __construct(
        private readonly ReferenceDataCacheInvalidator $cacheInvalidator,
    ) {}

    public function execute(Partner $partner): void
    {
        $partner->delete();

        $this->cacheInvalidator->forgetAll();
    }
}
