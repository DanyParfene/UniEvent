<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Event;
use App\Support\Contracts\AuthenticatedUser;
use App\Support\RoleName;

class EventPolicy
{
    public function viewAny(AuthenticatedUser $user): bool
    {
        return $this->hasEventRole($user);
    }

    public function view(AuthenticatedUser $user, Event $event): bool
    {
        return $this->canAccessEvent($user, $event);
    }

    public function create(AuthenticatedUser $user): bool
    {
        return $this->hasEventRole($user);
    }

    public function update(AuthenticatedUser $user, Event $event): bool
    {
        return $this->canAccessEvent($user, $event);
    }

    private function hasEventRole(AuthenticatedUser $user): bool
    {
        return $user->hasAnyRole([
            RoleName::SUPER_ADMINISTRATOR,
            RoleName::DEPARTMENT_ADMINISTRATOR,
            RoleName::COORDINATOR,
        ]);
    }

    private function canAccessEvent(AuthenticatedUser $user, Event $event): bool
    {
        if ($user->hasRole(RoleName::SUPER_ADMINISTRATOR)) {
            return true;
        }

        if ($user->hasAnyRole([RoleName::DEPARTMENT_ADMINISTRATOR, RoleName::COORDINATOR])) {
            return $event->department === null || $event->department === $user->department;
        }

        return false;
    }
}
