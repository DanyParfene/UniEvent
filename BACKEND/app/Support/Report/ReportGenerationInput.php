<?php

declare(strict_types=1);

namespace App\Support\Report;

/**
 * Serializable report request payload passed to the queued job.
 */
final readonly class ReportGenerationInput
{
    /**
     * @param  list<string>  $partnerIds
     * @param  list<string>  $eventIds
     * @param  array<string, mixed>  $filterParams
     */
    public function __construct(
        public int $userId,
        public ?string $reportTitle,
        public array $partnerIds,
        public array $eventIds,
        public array $filterParams,
    ) {}

    public function type(): ReportType
    {
        return $this->partnerIds !== [] ? ReportType::Partner : ReportType::Normal;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'report_title' => $this->reportTitle,
            'partner_ids' => $this->partnerIds,
            'event_ids' => $this->eventIds,
            'filter_params' => $this->filterParams,
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            userId: (int) $data['user_id'],
            reportTitle: isset($data['report_title']) ? (string) $data['report_title'] : null,
            partnerIds: array_values(array_map('strval', $data['partner_ids'] ?? [])),
            eventIds: array_values(array_map('strval', $data['event_ids'] ?? [])),
            filterParams: is_array($data['filter_params'] ?? null) ? $data['filter_params'] : [],
        );
    }
}
