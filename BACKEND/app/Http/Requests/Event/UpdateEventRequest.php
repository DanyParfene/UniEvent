<?php

declare(strict_types=1);

namespace App\Http\Requests\Event;

use App\Http\Requests\Event\Concerns\ValidatesEventCoreFields;
use App\Models\Event;
use App\Support\EventUpdatePayloadDetector;
use App\Support\EventUpdatePayloadType;
use App\Support\RoleName;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateEventRequest extends FormRequest
{
    use ValidatesEventCoreFields;

    private ?EventUpdatePayloadType $payloadType = null;

    public function authorize(): bool
    {
        $event = $this->route('event');

        return $event instanceof Event
            && $this->user()?->can('update', $event) === true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return match ($this->payloadType()) {
            EventUpdatePayloadType::Archive => $this->archiveFieldRules(),
            EventUpdatePayloadType::Metrics => $this->metricsFieldRules(),
            EventUpdatePayloadType::Core => $this->coreUpdateRules(),
        };
    }

    public function payloadType(): EventUpdatePayloadType
    {
        return $this->payloadType ??= app(EventUpdatePayloadDetector::class)
            ->detect($this);
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($this->payloadType() !== EventUpdatePayloadType::Core) {
                return;
            }

            $user = $this->user();
            $event = $this->route('event');
            if ($user === null || ! $event instanceof Event) {
                return;
            }

            if ($user->hasRole(RoleName::COORDINATOR) && $this->exists('coordinator_email')) {
                $email = strtolower((string) $this->input('coordinator_email'));
                if ($email !== strtolower((string) $user->email)) {
                    $validator->errors()->add(
                        'coordinator_email',
                        'Coordinators cannot assign a different coordinator_email.',
                    );
                }
            }

            if ($user->hasRole(RoleName::DEPARTMENT_ADMINISTRATOR) && $this->exists('department')) {
                if ($this->input('department') !== $user->department) {
                    $validator->errors()->add(
                        'department',
                        'Department administrators cannot change event department.',
                    );
                }
            }
        });
    }

    /**
     * @return array<string, mixed>
     */
    private function coreUpdateRules(): array
    {
        $rules = $this->coreFieldRules(partial: true);

        $user = $this->user();
        if ($user?->hasRole(RoleName::SUPER_ADMINISTRATOR)) {
            $rules['department'] = ['sometimes', 'string', 'max:255'];
        } else {
            unset($rules['department']);
        }

        return $rules;
    }
}
