<?php

declare(strict_types=1);

namespace App\Services\Report;

use App\Support\Report\ReportDataset;
use App\Support\Report\ReportType;
use Barryvdh\DomPDF\Facade\Pdf;

final class ReportPdfRenderer
{
    public function render(ReportDataset $dataset): string
    {
        $view = $dataset->type === ReportType::Partner
            ? 'reports.partner'
            : 'reports.normal';

        $pdf = Pdf::loadView($view, [
            'dataset' => $dataset,
            'title' => $dataset->reportTitle ?? $this->defaultTitle($dataset),
        ]);

        $pdf->setPaper('a4', 'portrait');

        return $pdf->output();
    }

    private function defaultTitle(ReportDataset $dataset): string
    {
        return $dataset->type === ReportType::Partner
            ? 'Raport parteneri'
            : 'Raport evenimente';
    }
}
