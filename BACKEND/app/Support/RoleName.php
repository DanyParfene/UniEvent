<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Canonical Spatie role names for the platform (guard: web).
 */
final class RoleName
{
    public const SUPER_ADMINISTRATOR = 'super_administrator';

    public const DEPARTMENT_ADMINISTRATOR = 'department_administrator';

    public const COORDINATOR = 'coordinator';

    /**
     * @return list<string>
     */
    public static function all(): array
    {
        return [
            self::SUPER_ADMINISTRATOR,
            self::DEPARTMENT_ADMINISTRATOR,
            self::COORDINATOR,
        ];
    }
}
