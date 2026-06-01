<?php

declare(strict_types=1);

namespace App\Http\Requests\Partner;

use App\Enums\Department;
use App\Support\RoleName;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePartnerRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null && $user->hasAnyRole([
            RoleName::SUPER_ADMINISTRATOR,
            RoleName::DEPARTMENT_ADMINISTRATOR,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name'       => ['required', 'string', 'max:255'],
            'logo_path'  => ['nullable', 'string', 'max:2048'],
            // Only meaningful for super_administrator (ignored for dept admins in the action).
            'department' => ['nullable', 'string', Rule::in(Department::all())],
        ];
    }
}
