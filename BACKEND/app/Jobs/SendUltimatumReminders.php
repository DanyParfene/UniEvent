<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Services\Reminder\EventReminderDispatcherService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendUltimatumReminders implements ShouldQueue
{
    use Queueable;

    public function handle(EventReminderDispatcherService $dispatcher): void
    {
        $dispatcher->dispatchUltimatumReminders();
    }
}
