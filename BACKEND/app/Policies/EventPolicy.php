<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Event;
use App\Models\User;
use App\Support\RoleName;

class EventPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->hasEventRole($user);
    }

    public function view(User $user, Event $event): bool
    {
        return $this->canAccessEvent($user, $event);
    }

    public function create(User $user): bool
    {
        return $this->hasEventRole($user);
    }

    public function update(User $user, Event $event): bool
    {
        return $this->canAccessEvent($user, $event);
    }

    private function hasEventRole(User $user): bool
    {
        return $user->hasAnyRole([
            RoleName::SUPER_ADMINISTRATOR,
            RoleName::DEPARTMENT_ADMINISTRATOR,
            RoleName::COORDINATOR,
        ]);
    }

    private function canAccessEvent(User $user, Event $event): bool
    {
        if ($user->hasRole(RoleName::SUPER_ADMINISTRATOR)) {
            return true;
        }

        if ($user->hasRole(RoleName::DEPARTMENT_ADMINISTRATOR)) {
            return $event->department === $user->department;
        }

        if ($user->hasRole(RoleName::COORDINATOR)) {
            return strcasecmp($event->coordinator_email, (string) $user->email) === 0;
        }

        return false;
    }
}
