<?php

declare(strict_types=1);

namespace App\Support\Report;

use App\Models\Event;

final readonly class ReportDataset
{
    /**
     * @param  list<ReportPartnerSection>|null  $partnerSections
     * @param  list<Event>|null  $events
     */
    public function __construct(
        public ReportType $type,
        public ?string $reportTitle,
        public ?array $partnerSections = null,
        public ?array $events = null,
    ) {}
}
