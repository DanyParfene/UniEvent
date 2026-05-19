<?php

declare(strict_types=1);

namespace App\Services\ScheduledReport;

use App\Models\User;
use App\Support\RoleName;
use Illuminate\Support\Collection;

final class ScheduledReportRecipientResolver
{
    /**
     * Weekly operational reports: super admins (global) and department admins (scoped).
     *
     * @return Collection<int, User>
     */
    public function weeklyRecipients(): Collection
    {
        return User::query()
            ->role([
                RoleName::SUPER_ADMINISTRATOR,
                RoleName::DEPARTMENT_ADMINISTRATOR,
            ])
            ->orderBy('name')
            ->get();
    }

    /**
     * Monthly centralized report: platform stakeholders (super administrators).
     *
     * @return Collection<int, User>
     */
    public function monthlyRecipients(): Collection
    {
        return User::query()
            ->role(RoleName::SUPER_ADMINISTRATOR)
            ->orderBy('name')
            ->get();
    }
}
