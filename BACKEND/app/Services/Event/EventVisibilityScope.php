<?php

declare(strict_types=1);

namespace App\Services\Event;

use App\Support\Contracts\AuthenticatedUser;
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
    public function apply(Builder $query, AuthenticatedUser $user, ?string $requestedDepartment = null): void
    {
        if ($user->hasRole(RoleName::SUPER_ADMINISTRATOR)) {
            if ($requestedDepartment !== null && $requestedDepartment !== '') {
                $query->where(function (Builder $q) use ($requestedDepartment): void {
                    $q->where('department', $requestedDepartment)
                      ->orWhereNull('department');
                });
            }

            return;
        }

        if ($user->hasAnyRole([RoleName::DEPARTMENT_ADMINISTRATOR, RoleName::COORDINATOR])) {
            $query->where(function (Builder $q) use ($user): void {
                $q->where('department', $user->department)
                  ->orWhereNull('department');
            });
        }
    }
}
