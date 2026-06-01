<?php

declare(strict_types=1);

namespace App\Http\Requests\Report;

use App\Enums\Department;
use App\Models\Event;
use App\Support\Report\ReportGenerationInput;
use App\Support\RoleName;
use App\Support\Validation\PartnerValidation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class GenerateReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('viewAny', Event::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $rules = [
            'partner_ids' => ['sometimes', 'array'],
            'partner_ids.*' => ['uuid', PartnerValidation::activePartnerIdExists()],
            'event_ids' => ['sometimes', 'array'],
            'event_ids.*' => ['uuid', 'exists:events,id'],
            'filter_params' => ['sometimes', 'array'],
            'filter_params.name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'filter_params.start_date' => ['sometimes', 'nullable', 'date'],
            'filter_params.end_date' => [
                'sometimes',
                'nullable',
                'date',
                'after_or_equal:filter_params.start_date',
            ],
            'filter_params.sort_by' => ['sometimes', 'string', Rule::in(['date', 'name'])],
            'filter_params.sort_direction' => ['sometimes', 'string', Rule::in(['asc', 'desc'])],
            'report_title' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];

        if ($this->user()?->hasRole(RoleName::SUPER_ADMINISTRATOR)) {
            $rules['filter_params.department'] = ['sometimes', 'nullable', Rule::in(Department::all())];
        }

        return $rules;
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $partnerIds = $this->input('partner_ids', []);
            $eventIds = $this->input('event_ids', []);
            $filterParams = $this->input('filter_params', []);

            $hasPartners = is_array($partnerIds) && $partnerIds !== [];
            $hasEvents = is_array($eventIds) && $eventIds !== [];
            $hasFilters = is_array($filterParams) && $this->hasNonEmptyFilterParams($filterParams);

            if (! $hasPartners && ! $hasEvents && ! $hasFilters) {
                $validator->errors()->add(
                    'partner_ids',
                    'Provide partner_ids, event_ids, or filter_params to generate a report.',
                );
            }
        });
    }

    public function toInput(): ReportGenerationInput
    {
        $validated = $this->validated();

        return new ReportGenerationInput(
            userId: (int) $this->user()->id,
            reportTitle: isset($validated['report_title']) ? (string) $validated['report_title'] : null,
            partnerIds: array_values($validated['partner_ids'] ?? []),
            eventIds: array_values($validated['event_ids'] ?? []),
            filterParams: $this->scopedFilterParams($validated['filter_params'] ?? []),
        );
    }

    /**
     * @param  array<string, mixed>  $filterParams
     * @return array<string, mixed>
     */
    private function scopedFilterParams(array $filterParams): array
    {
        if ($this->user()?->hasRole(RoleName::SUPER_ADMINISTRATOR)) {
            return $filterParams;
        }

        return collect($filterParams)->except('department')->all();
    }

    /**
     * @param  array<string, mixed>  $filterParams
     */
    private function hasNonEmptyFilterParams(array $filterParams): bool
    {
        foreach ($filterParams as $value) {
            if ($value !== null && $value !== '' && $value !== []) {
                return true;
            }
        }

        return false;
    }
}
