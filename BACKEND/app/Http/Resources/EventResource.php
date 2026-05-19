<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Event */
class EventResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'department' => $this->department,
            'name' => $this->name,
            'banner_url' => $this->banner_url,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'finish_date' => $this->finish_date?->format('Y-m-d'),
            'edition' => $this->edition,
            'organizer' => $this->organizer,
            'description' => $this->description,
            'location' => $this->location,
            'guests' => $this->guests ?? [],
            'mode' => $this->mode->value,
            'estimated_participants' => $this->estimated_participants,
            'target_group' => $this->target_group,
            'has_livestream' => $this->has_livestream->value,
            'coordinator_name' => $this->coordinator_name,
            'coordinator_email' => $this->coordinator_email,
            'coordinator_phone' => $this->coordinator_phone,
            'additional_info' => $this->additional_info,
            'status' => $this->status->value,
            'partners' => PartnerResource::collection($this->whenLoaded('partners')),
            'metrics' => EventMetricResource::collection($this->whenLoaded('metrics')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
