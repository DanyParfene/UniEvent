@php
    /** @var \App\Enums\EventReminderType $reminderType */
    /** @var \App\Models\Event $event */
@endphp
<x-mail::message>
# Reminder eveniment

**Eveniment:** {{ $event->name }}

**Perioadă:** {{ $event->start_date?->format('d.m.Y') }} – {{ $event->finish_date?->format('d.m.Y') }}

**Coordonator:** {{ $event->coordinator_name }} ({{ $event->coordinator_email }})

@if($reminderType === \App\Enums\EventReminderType::PreEvent)
Evenimentul începe peste **7 zile**. Verifică pregătirile și actualizează detaliile în platformă dacă este necesar.
@elseif($reminderType === \App\Enums\EventReminderType::PostEvent)
Evenimentul s-a încheiat acum **2 zile**. Te rugăm să completezi metricile de social media (Facebook, Instagram, TikTok) în platformă.
@else
Au trecut **7 zile** de la încheierea evenimentului, iar metricile de social media încă lipsesc. Completează-le urgent în platformă.
@endif

Mulțumim,<br>
{{ config('app.name') }}
</x-mail::message>
