<?php

declare(strict_types=1);

namespace App\Services\Report;

use App\Models\Partner;
use App\Support\Contracts\AuthenticatedUser;
use App\Support\Report\ReportDataset;
use App\Support\Report\ReportGenerationInput;
use App\Support\Report\ReportPartnerSection;
use App\Support\Report\ReportType;
use App\Support\RoleName;
use Illuminate\Validation\ValidationException;

final class ReportDatasetResolver
{
    public function __construct(
        private readonly ReportEventScopeQuery $scopeQuery,
        private readonly ReportEventOrderer $orderer,
    ) {}

    public function resolve(AuthenticatedUser $user, ReportGenerationInput $input): ReportDataset
    {
        $filterParams = $this->scopedFilterParams($user, $input->filterParams);

        if ($input->type() === ReportType::Partner) {
            return $this->resolvePartnerReport($user, $input, $filterParams);
        }

        return $this->resolveNormalReport($user, $input, $filterParams);
    }

    /**
     * @param  array<string, mixed>  $filterParams
     */
    private function resolvePartnerReport(
        AuthenticatedUser $user,
        ReportGenerationInput $input,
        array $filterParams,
    ): ReportDataset {
        $sections = [];

        $partnersById = Partner::query()
            ->whereIn('id', $input->partnerIds)
            ->get()
            ->keyBy('id');

        foreach ($input->partnerIds as $partnerId) {
            $partner = $partnersById->get($partnerId);

            if ($partner === null) {
                continue;
            }

            $events = $this->scopeQuery
                ->forPartner($user, $partnerId, $filterParams)
                ->get()
                ->all();

            $sections[] = new ReportPartnerSection($partner, $events);
        }

        return new ReportDataset(
            type: ReportType::Partner,
            reportTitle: $input->reportTitle,
            partnerSections: $sections,
        );
    }

    /**
     * @param  array<string, mixed>  $filterParams
     */
    private function resolveNormalReport(
        AuthenticatedUser $user,
        ReportGenerationInput $input,
        array $filterParams,
    ): ReportDataset {
        if ($input->eventIds !== []) {
            return $this->resolveFromEventIds($user, $input);
        }

        if ($filterParams !== []) {
            $events = $this->scopeQuery
                ->baseQuery($user, $filterParams)
                ->get()
                ->all();

            return new ReportDataset(
                type: ReportType::Normal,
                reportTitle: $input->reportTitle,
                events: $events,
            );
        }

        throw ValidationException::withMessages([
            'event_ids' => ['Provide event_ids or filter_params when partner_ids are absent.'],
        ]);
    }

    private function resolveFromEventIds(AuthenticatedUser $user, ReportGenerationInput $input): ReportDataset
    {
        $fetched = $this->scopeQuery
            ->forEventIds($user, $input->eventIds)
            ->get();

        $ordered = $this->orderer->orderByIds($input->eventIds, $fetched);

        $missing = array_diff($input->eventIds, array_map(fn ($e) => $e->id, $ordered));

        if ($missing !== []) {
            throw ValidationException::withMessages([
                'event_ids' => ['One or more events are not visible in your scope.'],
            ]);
        }

        return new ReportDataset(
            type: ReportType::Normal,
            reportTitle: $input->reportTitle,
            events: $ordered,
        );
    }

    /**
     * @param  array<string, mixed>  $filterParams
     * @return array<string, mixed>
     */
    private function scopedFilterParams(AuthenticatedUser $user, array $filterParams): array
    {
        if ($user->hasRole(RoleName::SUPER_ADMINISTRATOR)) {
            return $filterParams;
        }

        return collect($filterParams)->except('department')->all();
    }
}
