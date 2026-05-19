<?php

declare(strict_types=1);

namespace App\Services\Reminder;

use App\Enums\EventReminderType;
use App\Mail\EventReminderMail;
use App\Models\Event;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Mail;

final class EventReminderDispatcherService
{
    public function __construct(
        private readonly EventReminderQueryService $queries,
    ) {}

    public function dispatchPreEventReminders(?CarbonInterface $today = null): void
    {
        $this->dispatch(
            EventReminderType::PreEvent,
            $this->queries->preEventTargets($today ?? now()),
        );
    }

    public function dispatchPostEventReminders(?CarbonInterface $today = null): void
    {
        $this->dispatch(
            EventReminderType::PostEvent,
            $this->queries->postEventTargets($today ?? now()),
        );
    }

    public function dispatchUltimatumReminders(?CarbonInterface $today = null): void
    {
        $this->dispatch(
            EventReminderType::Ultimatum,
            $this->queries->ultimatumTargets($today ?? now()),
        );
    }

    /**
     * @param  Collection<int, Event>  $events
     */
    private function dispatch(EventReminderType $type, Collection $events): void
    {
        foreach ($events as $event) {
            Mail::to($event->coordinator_email)->send(new EventReminderMail($type, $event));
        }
    }
}
