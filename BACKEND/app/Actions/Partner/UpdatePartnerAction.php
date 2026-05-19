<?php

declare(strict_types=1);

namespace App\Actions\Partner;

use App\Models\Partner;
use App\Services\Cache\ReferenceDataCacheInvalidator;

final class UpdatePartnerAction
{
    public function __construct(
        private readonly ReferenceDataCacheInvalidator $cacheInvalidator,
    ) {}

    /**
     * @param  array{name: string, logo_path?: string|null}  $data
     */
    public function execute(Partner $partner, array $data): Partner
    {
        $partner->fill([
            'name' => $data['name'],
            'logo_path' => $data['logo_path'] ?? null,
        ]);
        $partner->save();

        $this->cacheInvalidator->forgetAll();

        return $partner->refresh();
    }
}
