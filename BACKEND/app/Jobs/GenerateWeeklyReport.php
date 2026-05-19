<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Services\ScheduledReport\ScheduledPeriodicReportService;
use App\Services\ScheduledReport\ScheduledReportRecipientResolver;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Throwable;

class GenerateWeeklyReport implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 300;

    public function handle(
        ScheduledReportRecipientResolver $recipients,
        ScheduledPeriodicReportService $reports,
    ): void {
        foreach ($recipients->weeklyRecipients() as $user) {
            $reports->deliverWeekly($user);
        }
    }

    public function failed(?Throwable $exception): void
    {
        Log::error('Weekly report generation failed', [
            'message' => $exception?->getMessage(),
        ]);
    }
}
