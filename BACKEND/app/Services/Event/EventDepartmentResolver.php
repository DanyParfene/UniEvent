<?php

declare(strict_types=1);

namespace App\Services\Event;

use App\Models\Event;
use App\Support\Contracts\AuthenticatedUser;
use App\Support\RoleName;
use Illuminate\Validation\ValidationException;

final class EventDepartmentResolver
{
    public function resolveForCreate(AuthenticatedUser $user, ?string $requestedDepartment): ?string
    {
        if ($user->hasRole(RoleName::SUPER_ADMINISTRATOR)) {
            if ($requestedDepartment === null || $requestedDepartment === '') {
                return null;
            }

            return $requestedDepartment;
        }

        if ($user->department === null || $user->department === '') {
            throw ValidationException::withMessages([
                'department' => ['Your account has no department assigned.'],
            ]);
        }

        return $user->department;
    }

    public function resolveForUpdate(AuthenticatedUser $user, Event $event, ?string $requestedDepartment): string
    {
        if ($user->hasRole(RoleName::SUPER_ADMINISTRATOR)) {
            if ($requestedDepartment !== null && $requestedDepartment !== '') {
                return $requestedDepartment;
            }

            return $event->department;
        }

        return $event->department;
    }
}
