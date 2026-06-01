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
            'eventName' => $this->event_name,
            'banner' => $this->banner,
            'startEventDate' => $this->start_event_date?->format('Y-m-d'),
            'finishEventDate' => $this->finish_event_date?->format('Y-m-d'),
            'edition' => $this->edition,
            'organizer' => $this->organizer,
            'description' => $this->description,
            'location' => $this->location,
            'invitations' => $this->invitations ?? [],
            'organizationMode' => $this->organization_mode->value,
            'numberOfParticipants' => $this->number_of_participants,
            'targetGroup' => $this->target_group,
            'livestream' => $this->livestream->value,
            'coordinator' => $this->coordinator,
            'email' => $this->email,
            'telephone' => $this->telephone,
            'otherInformation' => $this->other_information,
            'status' => $this->status->value,
            'partners' => PartnerResource::collection($this->whenLoaded('partners')),
            'metrics' => EventMetricResource::collection($this->whenLoaded('metrics')),
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
