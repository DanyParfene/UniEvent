<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\EventHasLivestream;
use App\Enums\EventMode;
use App\Enums\EventStatus;
use App\Support\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    /** @use HasFactory<\Database\Factories\EventFactory> */
    use HasFactory;
    use HasUuid;

    protected $fillable = [
        'department',
        'name',
        'banner_url',
        'start_date',
        'finish_date',
        'edition',
        'organizer',
        'description',
        'location',
        'guests',
        'mode',
        'estimated_participants',
        'target_group',
        'has_livestream',
        'coordinator_name',
        'coordinator_email',
        'coordinator_phone',
        'additional_info',
        'status',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'finish_date' => 'date',
            'guests' => 'array',
            'mode' => EventMode::class,
            'has_livestream' => EventHasLivestream::class,
            'status' => EventStatus::class,
            'estimated_participants' => 'integer',
            'edition' => 'integer',
        ];
    }

    /**
     * @return HasMany<EventMetric, $this>
     */
    public function metrics(): HasMany
    {
        return $this->hasMany(EventMetric::class);
    }

    /**
     * @return BelongsToMany<Partner, $this>
     */
    public function partners(): BelongsToMany
    {
        return $this->belongsToMany(Partner::class, 'event_partners')
            ->withTimestamps()
            ->withTrashed();
    }
}
