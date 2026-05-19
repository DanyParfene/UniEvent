<?php

declare(strict_types=1);

namespace App\Support\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * UUID primary key convention.
 *
 * The architecture (ARCHITECTURE.md §3) mandates UUIDs as the domain ID
 * strategy for events, partners, event_metrics, etc. Apply this trait
 * to every domain Eloquent model created in later steps so they auto-
 * fill their string UUID primary key on `creating` and disable
 * auto-incrementing integer keys.
 *
 * @mixin Model
 */
trait HasUuid
{
    public static function bootHasUuid(): void
    {
        static::creating(function (Model $model): void {
            $key = $model->getKeyName();

            if (empty($model->{$key})) {
                $model->{$key} = (string) Str::uuid();
            }
        });
    }

    public function initializeHasUuid(): void
    {
        $this->incrementing = false;
        $this->keyType = 'string';
    }
}
