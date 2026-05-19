<?php

declare(strict_types=1);

namespace App\Support\Report;

final readonly class MonthlyReportDataset
{
    /**
     * @param  list<array{name: string, reach: int}>  $topEvents
     * @param  list<array{department: string, count: int}>  $departmentDistribution
     */
    public function __construct(
        public string $reportTitle,
        public string $periodLabel,
        public int $totalReach,
        public array $topEvents,
        public array $departmentDistribution,
    ) {}

    public function hasContent(): bool
    {
        return $this->totalReach > 0
            || $this->topEvents !== []
            || $this->departmentDistribution !== [];
    }
}
