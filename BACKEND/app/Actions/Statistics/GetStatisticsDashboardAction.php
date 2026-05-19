<?php

declare(strict_types=1);

namespace App\Actions\Statistics;

use App\Models\User;
use App\Services\Statistics\StatisticsDashboardService;
use App\Support\CacheKeys;
use Illuminate\Support\Facades\Cache;

final class GetStatisticsDashboardAction
{
    private const CACHE_TTL_MINUTES = 5;

    public function __construct(
        private readonly StatisticsDashboardService $dashboardService,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function execute(User $user, ?string $department = null): array
    {
        $cacheKey = CacheKeys::statisticsDashboard((string) $user->id, $department);

        return Cache::tags(['statistics'])->remember(
            $cacheKey,
            now()->addMinutes(self::CACHE_TTL_MINUTES),
            fn (): array => $this->dashboardService->compute($user, $department),
        );
    }
}
