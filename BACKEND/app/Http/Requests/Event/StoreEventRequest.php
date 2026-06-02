<?php

declare(strict_types=1);

namespace App\Http\Requests\Event;

use App\Enums\Department;
use App\Http\Requests\Event\Concerns\ValidatesEventCoreFields;
use App\Models\Event;
use App\Support\RoleName;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreEventRequest extends FormRequest
{
    use ValidatesEventCoreFields;

    public function authorize(): bool
    {
        return $this->user()?->can('create', Event::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $rules = $this->coreFieldRules(partial: false);

        $user = $this->user();
        if ($user?->hasRole(RoleName::SUPER_ADMINISTRATOR)) {
            $rules['department'] = ['nullable', Rule::in(Department::all())];
        } else {
            unset($rules['department']);
        }

        return $rules;
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $user = $this->user();
            if ($user === null) {
                return;
            }

            if ($user->hasRole(RoleName::COORDINATOR)) {
                $email = strtolower((string) $this->input('email'));
                if ($email !== strtolower((string) $user->email)) {
                    $validator->errors()->add(
                        'email',
                        'Coordinators must use their own email as coordinator email.',
                    );
                }
            }
        });
    }
}
