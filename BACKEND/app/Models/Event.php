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
        'event_name',
        'banner',
        'start_event_date',
        'finish_event_date',
        'edition',
        'organizer',
        'description',
        'location',
        'invitations',
        'organization_mode',
        'number_of_participants',
        'target_group',
        'livestream',
        'coordinator',
        'email',
        'telephone',
        'other_information',
        'status',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_event_date' => 'date',
            'finish_event_date' => 'date',
            'invitations' => 'array',
            'organization_mode' => EventMode::class,
            'livestream' => EventHasLivestream::class,
            'status' => EventStatus::class,
            'number_of_participants' => 'integer',
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
