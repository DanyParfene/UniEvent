<?php

declare(strict_types=1);

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordTokenNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly string $token,
    ) {}

    /** @return list<string> */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject('Cod de resetare parolă — UniEvent')
            ->greeting('Salut!')
            ->line('Ai solicitat resetarea parolei pentru contul tău UniEvent.')
            ->line('Folosește următorul cod de recuperare:')
            ->line("**{$this->token}**")
            ->line('Acest cod expiră în 60 de minute.')
            ->line('Dacă nu ai solicitat această resetare, poți ignora acest email.')
            ->salutation('Echipa UniEvent');
    }
}
