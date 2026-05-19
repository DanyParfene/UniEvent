<?php

declare(strict_types=1);

namespace App\Support;

enum EventUpdatePayloadType: string
{
    case Archive = 'archive';
    case Metrics = 'metrics';
    case Core = 'core';
}
