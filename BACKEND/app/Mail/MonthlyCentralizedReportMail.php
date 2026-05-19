<?php

declare(strict_types=1);

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MonthlyCentralizedReportMail extends Mailable implements ShouldQueue
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        public readonly string $reportTitle,
        public readonly string $storagePath,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->reportTitle,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.reports.monthly-centralized',
            with: [
                'reportTitle' => $this->reportTitle,
            ],
        );
    }

    /**
     * @return list<Attachment>
     */
    public function attachments(): array
    {
        return [
            Attachment::fromStorageDisk('local', $this->storagePath)
                ->as(basename($this->storagePath))
                ->withMime('application/pdf'),
        ];
    }
}
