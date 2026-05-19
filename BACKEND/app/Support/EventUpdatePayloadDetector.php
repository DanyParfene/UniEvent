<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

final class EventUpdatePayloadDetector
{
    public function detect(Request $request): EventUpdatePayloadType
    {
        $isArchive = $request->has('archive') && $request->boolean('archive');
        $hasMetrics = $request->has('metrics');
        $hasCore = $this->hasCoreFields($request);

        $modes = array_filter([
            $isArchive ? EventUpdatePayloadType::Archive : null,
            $hasMetrics ? EventUpdatePayloadType::Metrics : null,
            $hasCore ? EventUpdatePayloadType::Core : null,
        ]);

        if (count($modes) !== 1) {
            throw ValidationException::withMessages([
                'payload' => ['Send exactly one update mode: core fields, metrics, or archive.'],
            ]);
        }

        return reset($modes);
    }

    private function hasCoreFields(Request $request): bool
    {
        $coreKeys = [
            'name', 'banner_url', 'start_date', 'finish_date', 'edition', 'organizer',
            'description', 'location', 'guests', 'mode', 'estimated_participants',
            'target_group', 'has_livestream', 'coordinator_name', 'coordinator_email',
            'coordinator_phone', 'additional_info', 'status', 'partner_ids', 'department',
        ];

        foreach ($coreKeys as $key) {
            if ($request->exists($key)) {
                return true;
            }
        }

        return false;
    }
}
