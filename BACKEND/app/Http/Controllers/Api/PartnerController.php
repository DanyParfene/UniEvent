<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Actions\Partner\CreatePartnerAction;
use App\Actions\Partner\DeletePartnerAction;
use App\Actions\Partner\ListPartnersAction;
use App\Actions\Partner\UpdatePartnerAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Partner\DestroyPartnerRequest;
use App\Http\Requests\Partner\IndexPartnersRequest;
use App\Http\Requests\Partner\StorePartnerRequest;
use App\Http\Requests\Partner\UpdatePartnerRequest;
use App\Http\Resources\PartnerResource;
use App\Models\Partner;
use App\Support\ApiResponse;
use App\Support\RoleName;
use Illuminate\Http\JsonResponse;

class PartnerController extends Controller
{
    public function index(IndexPartnersRequest $request, ListPartnersAction $action): JsonResponse
    {
        return ApiResponse::success(PartnerResource::collection($action->execute($request->scopedDepartment())));
    }

    public function store(StorePartnerRequest $request, CreatePartnerAction $action): JsonResponse
    {
        $user = $request->user();

        // Super admins send the target department explicitly (null = UVT-wide partner).
        // Department admins always own their JWT department regardless of what is sent.
        $department = $user?->hasRole(RoleName::SUPER_ADMINISTRATOR)
            ? ($request->validated()['department'] ?? null)
            : ($user?->department ?? null);

        $partner = $action->execute(array_merge($request->validated(), ['department' => $department]));

        return ApiResponse::created(
            (new PartnerResource($partner))->toArray($request),
            'Partner created successfully.',
        );
    }

    public function update(UpdatePartnerRequest $request, Partner $partner, UpdatePartnerAction $action): JsonResponse
    {
        $partner = $action->execute($partner, $request->validated());

        return ApiResponse::success(
            (new PartnerResource($partner))->toArray($request),
            'Partner updated successfully.',
        );
    }

    public function destroy(DestroyPartnerRequest $request, Partner $partner, DeletePartnerAction $action): JsonResponse
    {
        $action->execute($partner);

        return ApiResponse::noContent();
    }
}
