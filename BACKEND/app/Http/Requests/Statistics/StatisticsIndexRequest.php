<?php

declare(strict_types=1);

namespace App\Http\Requests\Statistics;

use App\Models\Event;
use App\Support\RoleName;
use Illuminate\Foundation\Http\FormRequest;

class StatisticsIndexRequest extends FormRequest
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
        $rules = [];

        if ($this->user()?->hasRole(RoleName::SUPER_ADMINISTRATOR)) {
            $rules['department'] = ['sometimes', 'nullable', 'string', 'max:255'];
        }

        return $rules;
    }

    public function requestedDepartment(): ?string
    {
        if (! $this->user()?->hasRole(RoleName::SUPER_ADMINISTRATOR)) {
            return null;
        }

        $department = $this->validated('department');

        return is_string($department) && $department !== '' ? $department : null;
    }
}
