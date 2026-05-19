<?php

declare(strict_types=1);

namespace App\Support\Report;

use App\Models\Event;
use App\Models\Partner;

final readonly class ReportPartnerSection
{
    /**
     * @param  list<Event>  $events
     */
    public function __construct(
        public Partner $partner,
        public array $events,
    ) {}
}
