<?php

declare(strict_types=1);

namespace App\Actions\Statistics;

use App\Services\Statistics\StatisticsDashboardService;
use App\Support\Contracts\AuthenticatedUser;

final class GetStatisticsDashboardAction
{
    public function __construct(
        private readonly StatisticsDashboardService $dashboardService,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function execute(AuthenticatedUser $user, ?string $department = null): array
    {
        return $this->dashboardService->compute($user, $department);
    }
}
