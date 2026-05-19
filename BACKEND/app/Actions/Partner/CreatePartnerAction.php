<?php

declare(strict_types=1);

namespace App\Actions\Partner;

use App\Models\Partner;
use App\Services\Cache\ReferenceDataCacheInvalidator;

final class CreatePartnerAction
{
    public function __construct(
        private readonly ReferenceDataCacheInvalidator $cacheInvalidator,
    ) {}

    /**
     * @param  array{name: string, logo_path?: string|null}  $data
     */
    public function execute(array $data): Partner
    {
        $partner = Partner::query()->create([
            'name' => $data['name'],
            'logo_path' => $data['logo_path'] ?? null,
        ]);

        $this->cacheInvalidator->forgetAll();

        return $partner;
    }
}
