<?php

declare(strict_types=1);

namespace App\Support\Event;

use App\Enums\EventMetricCategory;

/**
 * Social media metric categories used for reminder targeting.
 */
final class SocialMetricCategories
{
    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_map(
            static fn (EventMetricCategory $category): string => $category->value,
            self::cases(),
        );
    }

    /**
     * @return list<EventMetricCategory>
     */
    public static function cases(): array
    {
        return [
            EventMetricCategory::Facebook,
            EventMetricCategory::Instagram,
            EventMetricCategory::TikTok,
        ];
    }
}
