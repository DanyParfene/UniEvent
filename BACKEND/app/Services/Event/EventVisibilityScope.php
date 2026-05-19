<?php

declare(strict_types=1);

namespace App\Services\Event;

use App\Models\User;
use App\Support\RoleName;
use Illuminate\Database\Eloquent\Builder;

/**
 * RBAC base scope for event queries (listing, statistics, reports).
 */
final class EventVisibilityScope
{
    /**
     * @param  Builder<\App\Models\Event>  $query
     */
    public function apply(Builder $query, User $user, ?string $requestedDepartment = null): void
    {
        if ($user->hasRole(RoleName::SUPER_ADMINISTRATOR)) {
            if ($requestedDepartment !== null && $requestedDepartment !== '') {
                $query->where('department', $requestedDepartment);
            }

            return;
        }

        if ($user->hasRole(RoleName::DEPARTMENT_ADMINISTRATOR)) {
            $query->where('department', $user->department);

            return;
        }

        if ($user->hasRole(RoleName::COORDINATOR)) {
            $query->whereRaw(
                'LOWER(coordinator_email) = ?',
                [strtolower((string) $user->email)],
            );
        }
    }
}
