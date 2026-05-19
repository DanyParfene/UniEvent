<?php

declare(strict_types=1);

namespace App\Http\Requests\Event\Concerns;

use App\Enums\EventHasLivestream;
use App\Enums\EventMode;
use App\Enums\EventStatus;
use App\Support\Validation\PartnerValidation;
use Illuminate\Validation\Rule;

trait ValidatesEventCoreFields
{
    /**
     * @return array<string, mixed>
     */
    protected function coreFieldRules(bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        $finishDateRules = [$required, 'date', 'date_format:Y-m-d'];
        if (! $partial) {
            $finishDateRules[] = 'after:start_date';
        } else {
            $finishDateRules[] = $this->finishDateAfterStartRule();
        }

        return [
            'name' => [$required, 'string', 'max:255'],
            'banner_url' => [$required, 'string', 'max:2048'],
            'start_date' => [$required, 'date', 'date_format:Y-m-d'],
            'finish_date' => $finishDateRules,
            'edition' => [$required, 'integer', 'min:1'],
            'organizer' => [$required, 'string', 'max:255'],
            'description' => [$required, 'string'],
            'location' => [$required, 'string', 'max:255'],
            'guests' => ['nullable', 'array'],
            'guests.*' => ['string', 'max:255'],
            'mode' => [$required, Rule::enum(EventMode::class)],
            'estimated_participants' => [$required, 'integer', 'min:1'],
            'target_group' => [$required, 'string', 'max:255'],
            'has_livestream' => [$required, Rule::enum(EventHasLivestream::class)],
            'coordinator_name' => [$required, 'string', 'max:255'],
            'coordinator_email' => [$required, 'string', 'email', 'max:255'],
            'coordinator_phone' => [$required, 'string', 'max:50'],
            'additional_info' => ['nullable', 'string'],
            'status' => [$required, Rule::enum(EventStatus::class)],
            'partner_ids' => ['nullable', 'array'],
            'partner_ids.*' => ['uuid', PartnerValidation::activePartnerIdExists()],
            'department' => ['sometimes', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function metricsFieldRules(): array
    {
        return [
            'metrics' => ['required', 'array', 'min:1'],
            'metrics.*.category' => ['required', 'string', Rule::enum(\App\Enums\EventMetricCategory::class)],
            'metrics.*.link' => ['required', 'string', 'url', 'max:2048'],
            'metrics.*.reach' => ['required', 'integer', 'min:0'],
            'metrics.*.engagement' => ['required', 'integer', 'min:0'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function archiveFieldRules(): array
    {
        return [
            'archive' => ['required', 'boolean', 'accepted'],
        ];
    }

    /**
     * @return \Closure(string, mixed, \Closure): void
     */
    private function finishDateAfterStartRule(): \Closure
    {
        return function (string $attribute, mixed $value, \Closure $fail): void {
            $start = $this->input('start_date');
            if ($start === null && method_exists($this, 'route')) {
                $event = $this->route('event');
                $start = $event?->start_date?->format('Y-m-d');
            }

            if ($start !== null && $value !== null && $value <= $start) {
                $fail('The finish date must be after the start date.');
            }
        };
    }
}
