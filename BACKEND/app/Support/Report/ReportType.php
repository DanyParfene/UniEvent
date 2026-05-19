<?php

declare(strict_types=1);

namespace App\Support\Report;

enum ReportType: string
{
    case Partner = 'partner';
    case Normal = 'normal';
}
