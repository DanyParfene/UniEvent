<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Actions\Statistics\GetStatisticsDashboardAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Statistics\StatisticsIndexRequest;
use App\Http\Resources\StatisticsDashboardResource;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class StatisticsController extends Controller
{
    public function index(
        StatisticsIndexRequest $request,
        GetStatisticsDashboardAction $action,
    ): JsonResponse {
        $dashboard = $action->execute(
            $request->user(),
            $request->requestedDepartment(),
        );

        return ApiResponse::success(
            (new StatisticsDashboardResource($dashboard))->toArray($request),
        );
    }
}
