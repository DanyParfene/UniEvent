<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Support\Facades\Log;

/**
 * Lightweight request-scoped profiler.
 *
 * Usage:
 *   $t = Trace::now();
 *   // ... operation ...
 *   Trace::mark('label', $t);          // logs elapsed ms
 *   Trace::mark('label', $t, ['k'=>v]); // with extra context
 */
final class Trace
{
    public static function now(): float
    {
        return microtime(true);
    }

    public static function mark(string $label, float $since, array $context = []): void
    {
        $ms = round((microtime(true) - $since) * 1000, 3);

        Log::debug("[TRACE] {$label}", array_merge(['ms' => $ms], $context));
    }
}
