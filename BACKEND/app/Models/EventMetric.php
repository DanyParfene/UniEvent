<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\EventMetricCategory;
use App\Support\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventMetric extends Model
{
    use HasUuid;

    protected $fillable = [
        'event_id',
        'category',
        'link',
        'reach',
        'engagement',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'category' => EventMetricCategory::class,
            'reach' => 'integer',
            'engagement' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Event, $this>
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
