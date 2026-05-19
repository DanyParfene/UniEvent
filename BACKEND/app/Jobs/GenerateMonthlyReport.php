<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Services\ScheduledReport\ScheduledPeriodicReportService;
use App\Services\ScheduledReport\ScheduledReportRecipientResolver;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Throwable;

class GenerateMonthlyReport implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 300;

    public function handle(
        ScheduledReportRecipientResolver $recipients,
        ScheduledPeriodicReportService $reports,
    ): void {
        foreach ($recipients->monthlyRecipients() as $user) {
            $reports->deliverMonthly($user);
        }
    }

    public function failed(?Throwable $exception): void
    {
        Log::error('Monthly report generation failed', [
            'message' => $exception?->getMessage(),
        ]);
    }
}
