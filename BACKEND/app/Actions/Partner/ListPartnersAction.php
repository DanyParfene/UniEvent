<?php

declare(strict_types=1);

namespace App\Actions\Partner;

use App\Models\Partner;
use App\Services\Partner\CachedPartnerListService;
use Illuminate\Database\Eloquent\Collection;

final class ListPartnersAction
{
    public function __construct(
        private readonly CachedPartnerListService $partnerList,
    ) {}

    /**
     * @return Collection<int, Partner>
     */
    public function execute(?string $department): Collection
    {
        return $this->partnerList->forDepartment($department);
    }
}
