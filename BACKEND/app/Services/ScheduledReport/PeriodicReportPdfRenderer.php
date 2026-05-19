<?php

declare(strict_types=1);

namespace App\Services\ScheduledReport;

use App\Support\Report\MonthlyReportDataset;
use App\Support\Report\WeeklyReportDataset;
use Barryvdh\DomPDF\Facade\Pdf;

final class PeriodicReportPdfRenderer
{
    public function renderWeekly(WeeklyReportDataset $dataset): string
    {
        $pdf = Pdf::loadView('reports.weekly', [
            'dataset' => $dataset,
            'title' => $dataset->reportTitle,
        ]);
        $pdf->setPaper('a4', 'portrait');

        return $pdf->output();
    }

    public function renderMonthly(MonthlyReportDataset $dataset): string
    {
        $pdf = Pdf::loadView('reports.monthly', [
            'dataset' => $dataset,
            'title' => $dataset->reportTitle,
        ]);
        $pdf->setPaper('a4', 'portrait');

        return $pdf->output();
    }
}
