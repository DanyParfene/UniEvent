<?php

declare(strict_types=1);

namespace App\Enums;

enum EventReminderType: string
{
    case PreEvent = 'pre_event';
    case PostEvent = 'post_event';
    case Ultimatum = 'ultimatum';
}
