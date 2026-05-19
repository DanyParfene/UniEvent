<?php

declare(strict_types=1);

namespace App\Http\Requests\Partner;

use App\Support\RoleName;
use Illuminate\Foundation\Http\FormRequest;

class DestroyPartnerRequest extends FormRequest
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
        return [];
    }
}
