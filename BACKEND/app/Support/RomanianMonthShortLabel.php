<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Maps calendar month numbers to Romanian short labels for dashboard charts.
 */
final class RomanianMonthShortLabel
{
    private const LABELS = [
        1 => 'Ian',
        2 => 'Feb',
        3 => 'Mar',
        4 => 'Apr',
        5 => 'Mai',
        6 => 'Iun',
        7 => 'Iul',
        8 => 'Aug',
        9 => 'Sep',
        10 => 'Oct',
        11 => 'Nov',
        12 => 'Dec',
    ];

    public static function for(int $month): string
    {
        if (! isset(self::LABELS[$month])) {
            throw new \InvalidArgumentException("Invalid month number: {$month}");
        }

        return self::LABELS[$month];
    }
}
