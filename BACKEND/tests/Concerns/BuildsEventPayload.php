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
            'name' => 'Conferință Test',
            'banner_url' => 'https://example.com/banner.jpg',
            'start_date' => now()->addWeek()->toDateString(),
            'finish_date' => now()->addWeeks(2)->toDateString(),
            'edition' => 1,
            'organizer' => 'Facultatea Test',
            'description' => 'Descriere eveniment test.',
            'location' => 'Aula Magna',
            'guests' => ['Invitat 1'],
            'mode' => EventMode::Physical->value,
            'estimated_participants' => 120,
            'target_group' => 'Studenți',
            'has_livestream' => EventHasLivestream::NO->value,
            'coordinator_name' => 'Coordonator Test',
            'coordinator_email' => 'coord.test@e-uvt.ro',
            'coordinator_phone' => '+40700000000',
            'additional_info' => null,
            'status' => EventStatus::Published->value,
            'partner_ids' => [],
        ], $overrides);
    }
}
