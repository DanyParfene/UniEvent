<?php

declare(strict_types=1);

namespace App\Http\Requests\Event;

use App\Enums\Department;
use App\Models\Event;
use App\Support\RoleName;
use App\Support\Validation\PartnerValidation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexEventsRequest extends FormRequest
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
            'name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'start_date' => ['sometimes', 'nullable', 'date'],
            'end_date' => ['sometimes', 'nullable', 'date', 'after_or_equal:start_date'],
            'partners' => ['sometimes', 'array'],
            'partners.*' => ['uuid', PartnerValidation::activePartnerIdExists()],
            'sort_by' => ['sometimes', 'string', Rule::in(['date', 'name'])],
            'sort_direction' => ['sometimes', 'string', Rule::in(['asc', 'desc'])],
            'page' => ['sometimes', 'integer', 'min:1'],
            'archived' => ['sometimes', 'boolean'],
        ];

        if ($this->user()?->hasRole(RoleName::SUPER_ADMINISTRATOR)) {
            $rules['department'] = ['sometimes', 'nullable', Rule::in(Department::all())];
        }

        return $rules;
    }

    /**
     * @return array<string, mixed>
     */
    public function listingFilters(): array
    {
        $validated = $this->validated();

        if ($this->user()?->hasRole(RoleName::SUPER_ADMINISTRATOR)) {
            return $validated;
        }

        return collect($validated)->except('department')->all();
    }
}
