<?php

declare(strict_types=1);

namespace App\Services\ScheduledReport;

use App\Mail\EventReportMail;
use App\Mail\MonthlyCentralizedReportMail;
use App\Models\User;
use App\Services\Report\ReportStorageService;
use Illuminate\Support\Facades\Mail;

final class ScheduledPeriodicReportService
{
    public function __construct(
        private readonly WeeklyReportDataService $weeklyData,
        private readonly MonthlyReportAggregationService $monthlyData,
        private readonly PeriodicReportPdfRenderer $renderer,
        private readonly ReportStorageService $storage,
    ) {}

    public function deliverWeekly(User $user): void
    {
        $dataset = $this->weeklyData->build($user);

        if (! $dataset->hasContent()) {
            return;
        }

        $path = $this->storage->store($this->renderer->renderWeekly($dataset), $user->id);

        Mail::to($user->email)->send(new EventReportMail($dataset->reportTitle, $path));
    }

    public function deliverMonthly(User $user): void
    {
        $dataset = $this->monthlyData->build($user);

        if (! $dataset->hasContent()) {
            return;
        }

        $path = $this->storage->store($this->renderer->renderMonthly($dataset), $user->id);

        Mail::to($user->email)->send(new MonthlyCentralizedReportMail(
            $dataset->reportTitle,
            $path,
        ));
    }
}
