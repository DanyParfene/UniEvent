<?php

declare(strict_types=1);

namespace App\Actions\Partner;

use App\Models\Partner;

final class UpdatePartnerAction
{
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

        return $partner->refresh();
    }
}
