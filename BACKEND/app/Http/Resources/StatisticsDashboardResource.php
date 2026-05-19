<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin array{
 *   best_partner: ?\App\Models\Partner,
 *   last_month_press_aparitions: int,
 *   next_5_events: array<int, array{name: string, id: string}>|string,
 *   best_organizator: ?string,
 *   most_participants: int,
 *   number_of_events_per_month: array<int, array{month: string, count: int}>
 * }
 */
class StatisticsDashboardResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = $this->resource;

        return [
            'best_partner' => $data['best_partner'] !== null
                ? (new PartnerResource($data['best_partner']))->toArray($request)
                : null,
            'last_month_press_aparitions' => $data['last_month_press_aparitions'],
            'next_5_events' => $data['next_5_events'],
            'best_organizator' => $data['best_organizator'],
            'most_participants' => $data['most_participants'],
            'number_of_events_per_month' => $data['number_of_events_per_month'],
        ];
    }
}
