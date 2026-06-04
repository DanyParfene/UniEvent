<?php

declare(strict_types=1);

namespace App\Actions\Partner;

use App\Models\Partner;

final class CreatePartnerAction
{
    /**
     * @param  array{name: string, logo_path?: string|null, department?: string|null}  $data
     */
    public function execute(array $data): Partner
    {
        return Partner::query()->create([
            'name'       => $data['name'],
            'logo_path'  => $data['logo_path'] ?? null,
            'department' => $data['department'] ?? null,
        ]);
    }
}
