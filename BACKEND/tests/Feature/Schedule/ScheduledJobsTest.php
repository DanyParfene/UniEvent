<?php

declare(strict_types=1);

namespace Tests\Feature\Schedule;

use Illuminate\Console\Scheduling\Schedule;
use Tests\TestCase;

class ScheduledJobsTest extends TestCase
{
    public function test_schedule_registers_reminder_report_and_backup_tasks(): void
    {
        $events = app(Schedule::class)->events();

        $this->assertGreaterThanOrEqual(7, count($events));

        $summaries = collect($events)
            ->map(fn ($event) => $event->getSummaryForDisplay())
            ->implode("\n");

        $this->assertStringContainsString('SendPreEventReminders', $summaries);
        $this->assertStringContainsString('SendPostEventReminders', $summaries);
        $this->assertStringContainsString('SendUltimatumReminders', $summaries);
        $this->assertStringContainsString('GenerateWeeklyReport', $summaries);
        $this->assertStringContainsString('GenerateMonthlyReport', $summaries);
        $this->assertStringContainsString('backup:run', $summaries);
    }

    public function test_schedule_list_command_succeeds(): void
    {
        $this->artisan('schedule:list')->assertSuccessful();
    }
}
