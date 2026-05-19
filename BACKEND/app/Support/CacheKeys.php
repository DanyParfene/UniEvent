<?php

declare(strict_types=1);

namespace App\Support;

final class CacheKeys
{
    public const PARTNERS_LIST = 'reference.partners.list';

    public const STATISTICS_PREFIX = 'statistics.dashboard.';

    public static function statisticsDashboard(string $userId, ?string $department): string
    {
        $departmentKey = $department !== null && $department !== ''
            ? md5($department)
            : 'all';

        return self::STATISTICS_PREFIX.$userId.'.'.$departmentKey;
    }
}
