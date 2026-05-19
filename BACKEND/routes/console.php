<?php

use App\Jobs\GenerateMonthlyReport;
use App\Jobs\GenerateWeeklyReport;
use App\Jobs\SendPostEventReminders;
use App\Jobs\SendPreEventReminders;
use App\Jobs\SendUltimatumReminders;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::job(new SendPreEventReminders)->dailyAt('08:00');
Schedule::job(new SendPostEventReminders)->dailyAt('08:00');
Schedule::job(new SendUltimatumReminders)->dailyAt('08:00');
Schedule::job(new GenerateWeeklyReport)->weeklyOn(1, '08:00');
Schedule::job(new GenerateMonthlyReport)->monthlyOn(1, '08:00');

Schedule::command('backup:clean')->daily()->at('01:00');
Schedule::command('backup:run', ['--only-db' => true])->daily()->at('01:30');
