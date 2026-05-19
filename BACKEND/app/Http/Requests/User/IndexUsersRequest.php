<?php

declare(strict_types=1);

namespace App\Http\Requests\User;

use App\Support\RoleName;
use Illuminate\Foundation\Http\FormRequest;

class IndexUsersRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole(RoleName::SUPER_ADMINISTRATOR) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [];
    }
}
