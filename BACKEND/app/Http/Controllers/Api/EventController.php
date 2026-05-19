<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Actions\Event\ArchiveEventAction;
use App\Actions\Event\CreateEventAction;
use App\Actions\Event\ListEventsAction;
use App\Actions\Event\UpdateEventCoreAction;
use App\Actions\Event\UpdateEventMetricsAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Event\IndexEventsRequest;
use App\Http\Requests\Event\StoreEventRequest;
use App\Http\Requests\Event\UpdateEventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Support\ApiResponse;
use App\Support\EventUpdatePayloadType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(IndexEventsRequest $request, ListEventsAction $action): JsonResponse
    {
        $paginator = $action->execute($request->user(), $request->listingFilters());

        $paginator->through(
            fn (Event $event) => (new EventResource($event))->toArray($request),
        );

        return ApiResponse::success($paginator);
    }

    public function store(StoreEventRequest $request, CreateEventAction $action): JsonResponse
    {
        $event = $action->execute($request->user(), $request->validated());

        return ApiResponse::created(
            (new EventResource($event))->toArray($request),
            'Event created successfully.',
        );
    }

    public function show(Request $request, Event $event): JsonResponse
    {
        $this->authorize('view', $event);

        $event->load(['metrics', 'partners']);

        return ApiResponse::success(
            (new EventResource($event))->toArray($request),
        );
    }

    public function update(UpdateEventRequest $request, Event $event, UpdateEventCoreAction $coreAction, UpdateEventMetricsAction $metricsAction, ArchiveEventAction $archiveAction): JsonResponse
    {
        $event = match ($request->payloadType()) {
            EventUpdatePayloadType::Archive => $archiveAction->execute($event),
            EventUpdatePayloadType::Metrics => $metricsAction->execute($event, $request->validated('metrics')),
            EventUpdatePayloadType::Core => $coreAction->execute($request->user(), $event, $request->validated()),
        };

        return ApiResponse::success(
            (new EventResource($event))->toArray($request),
            'Event updated successfully.',
        );
    }
}
