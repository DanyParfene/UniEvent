<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Actions\Report\RequestReportGenerationAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Report\GenerateReportRequest;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class ReportController extends Controller
{
    public function store(
        GenerateReportRequest $request,
        RequestReportGenerationAction $action,
    ): JsonResponse {
        $result = $action->execute($request->user(), $request->toInput());

        return ApiResponse::success(
            $result,
            'Report generation has been queued. You will receive the PDF by email shortly.',
            Response::HTTP_ACCEPTED,
        );
    }
}
