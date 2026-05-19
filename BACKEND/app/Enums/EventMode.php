<?php

declare(strict_types=1);

namespace App\Enums;

enum EventMode: string
{
    case Physical = 'physical';
    case Hybrid = 'hybrid';
    case Online = 'online';
}
