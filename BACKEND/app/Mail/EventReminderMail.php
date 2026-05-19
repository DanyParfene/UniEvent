<?php

declare(strict_types=1);

namespace App\Mail;

use App\Enums\EventReminderType;
use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EventReminderMail extends Mailable implements ShouldQueue
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        public readonly EventReminderType $reminderType,
        public readonly Event $event,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subjectForType(),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.reminders.event-reminder',
            with: [
                'reminderType' => $this->reminderType,
                'event' => $this->event,
            ],
        );
    }

    private function subjectForType(): string
    {
        return match ($this->reminderType) {
            EventReminderType::PreEvent => 'Reminder: eveniment în 7 zile — '.$this->event->name,
            EventReminderType::PostEvent => 'Reminder: completează metricile sociale — '.$this->event->name,
            EventReminderType::Ultimatum => 'Ultimatum: metrici sociale lipsă — '.$this->event->name,
        };
    }
}
