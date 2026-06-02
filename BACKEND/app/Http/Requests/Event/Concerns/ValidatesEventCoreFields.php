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
            $finishDateRules[] = 'after_or_equal:start_event_date';
        } else {
            $finishDateRules[] = $this->finishDateAfterStartRule();
        }

        return [
            'event_name' => [$required, 'string', 'max:255'],
            'banner' => [$required, 'string', 'max:2048'],
            'start_event_date' => [$required, 'date', 'date_format:Y-m-d'],
            'finish_event_date' => $finishDateRules,
            'edition' => [$required, 'integer', 'min:1'],
            'organizer' => [$required, 'string', 'max:255'],
            'description' => [$required, 'string'],
            'location' => [$required, 'string', 'max:255'],
            'invitations' => ['nullable', 'array'],
            'invitations.*' => ['string', 'max:255'],
            'organization_mode' => [$required, Rule::enum(EventMode::class)],
            'number_of_participants' => [$required, 'integer', 'min:1'],
            'target_group' => [$required, 'string', 'max:255'],
            'livestream' => [$required, Rule::enum(EventHasLivestream::class)],
            'coordinator' => [$required, 'string', 'max:255'],
            'email' => [$required, 'string', 'email', 'max:255'],
            'telephone' => [$required, 'string', 'max:50'],
            'other_information' => ['nullable', 'string'],
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
            $start = $this->input('start_event_date');
            if ($start === null && method_exists($this, 'route')) {
                $event = $this->route('event');
                $start = $event?->start_event_date?->format('Y-m-d');
            }

            if ($start !== null && $value !== null && $value < $start) {
                $fail('The finish date must be on or after the start date.');
            }
        };
    }
}
