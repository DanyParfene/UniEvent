<?php

declare(strict_types=1);

namespace Tests\Concerns;

use App\Enums\EventHasLivestream;
use App\Enums\EventMode;
use App\Enums\EventStatus;

trait BuildsEventPayload
{
    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    protected function validEventPayload(array $overrides = []): array
    {
        return array_merge([
            'event_name' => 'Conferință Test',
            'banner' => 'https://example.com/banner.jpg',
            'start_event_date' => now()->addWeek()->toDateString(),
            'finish_event_date' => now()->addWeeks(2)->toDateString(),
            'edition' => 1,
            'organizer' => 'Facultatea Test',
            'description' => 'Descriere eveniment test.',
            'location' => 'Aula Magna',
            'invitations' => ['Invitat 1'],
            'organization_mode' => EventMode::Physical->value,
            'number_of_participants' => 120,
            'target_group' => 'Studenți',
            'livestream' => EventHasLivestream::NO->value,
            'coordinator' => 'Coordonator Test',
            'email' => 'coord.test@e-uvt.ro',
            'telephone' => '+40700000000',
            'other_information' => null,
            'status' => EventStatus::Published->value,
            'partner_ids' => [],
        ], $overrides);
    }
}
