<?php

declare(strict_types=1);

namespace App\Http\Requests\Partner;

use App\Enums\Department;
use App\Support\RoleName;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexPartnersRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'department' => ['nullable', 'string', Rule::in(Department::all())],
        ];
    }

    /**
     * Returns the effective department filter for the partner list query.
     *
     * - super_administrator: uses the optional ?department= query param (null = all)
     * - department_administrator / coordinator: always their own department from JWT
     */
    public function scopedDepartment(): ?string
    {
        $user = $this->user();

        if ($user === null) {
            return null;
        }

        if ($user->hasRole(RoleName::SUPER_ADMINISTRATOR)) {
            $dept = $this->validated()['department'] ?? null;

            return ($dept !== null && $dept !== '') ? $dept : null;
        }

        return $user->department ?? null;
    }
}
