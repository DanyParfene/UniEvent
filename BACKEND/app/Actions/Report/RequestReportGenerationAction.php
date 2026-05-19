<?php

declare(strict_types=1);

namespace App\Actions\Report;

use App\Jobs\GenerateReportJob;
use App\Models\User;
use App\Services\Report\ReportDatasetResolver;
use App\Support\Report\ReportGenerationInput;
use Illuminate\Validation\ValidationException;

final class RequestReportGenerationAction
{
    public function __construct(
        private readonly ReportDatasetResolver $datasetResolver,
    ) {}

    /**
     * @return array{queued: true, report_type: string}
     */
    public function execute(User $user, ReportGenerationInput $input): array
    {
        $dataset = $this->datasetResolver->resolve($user, $input);

        if ($dataset->type->value === 'partner') {
            $hasEvents = collect($dataset->partnerSections ?? [])
                ->contains(fn ($section) => $section->events !== []);
        } else {
            $hasEvents = ($dataset->events ?? []) !== [];
        }

        if (! $hasEvents) {
            $field = match (true) {
                $input->partnerIds !== [] => 'partner_ids',
                $input->eventIds !== [] => 'event_ids',
                default => 'filter_params',
            };

            throw ValidationException::withMessages([
                $field => ['No events match the report criteria within your scope.'],
            ]);
        }

        GenerateReportJob::dispatch($input->toArray());

        return [
            'queued' => true,
            'report_type' => $input->type()->value,
        ];
    }
}
