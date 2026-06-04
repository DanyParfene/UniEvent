<?php

declare(strict_types=1);

namespace App\Actions\Partner;

use App\Models\Partner;

final class DeletePartnerAction
{
    public function execute(Partner $partner): void
    {
        $partner->delete();
    }
}
