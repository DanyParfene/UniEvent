<?php

declare(strict_types=1);

namespace App\Actions\Partner;

use App\Models\Partner;
use Illuminate\Database\Eloquent\Collection;

final class ListPartnersAction
{
    /**
     * @return Collection<int, Partner>
     */
    public function execute(?string $department): Collection
    {
        $query = Partner::query()->orderBy('name');

        if ($department !== null) {
            $query->where(function ($q) use ($department): void {
                $q->where('department', $department)
                    ->orWhereNull('department');
            });
        }

        return $query->get();
    }
}
