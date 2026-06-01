<?php

declare(strict_types=1);

namespace App\Enums;

enum Department: string
{
    case ARTE = 'ARTE';
    case CBG = 'CBG';
    case DREPT = 'DREPT';
    case FEAA = 'FEAA';
    case FEFS = 'FEFS';
    case FFM = 'FFM';
    case INFO = 'INFO';
    case FLIFT = 'FLIFT';
    case FMT = 'FMT';
    case FPSE = 'FPSE';
    case FSAS = 'FSAS';
    case FSGC = 'FSGC';

    /**
     * @return list<string>
     */
    public static function all(): array
    {
        return array_column(self::cases(), 'value');
    }
}
