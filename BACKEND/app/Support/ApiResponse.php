<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Symfony\Component\HttpFoundation\Response;

/**
 * Centralized API response shaper.
 *
 * Every API endpoint should return through this helper so the frontend
 * gets a predictable envelope:
 *  - success: { data: ..., meta?: ..., message?: ... }
 *  - error:   { message: ..., errors?: ... }
 */
final class ApiResponse
{
    /**
     * Send a successful JSON response.
     *
     * @param  array<string,mixed>  $headers
     */
    public static function success(
        mixed $data = null,
        ?string $message = null,
        int $status = Response::HTTP_OK,
        array $headers = [],
    ): JsonResponse {
        $payload = [
            'data' => self::normalize($data),
        ];

        if ($message !== null) {
            $payload['message'] = $message;
        }

        if ($data instanceof LengthAwarePaginator) {
            $payload['data'] = self::normalize($data->items());
            $payload['meta'] = [
                'current_page' => $data->currentPage(),
                'per_page' => $data->perPage(),
                'total' => $data->total(),
                'last_page' => $data->lastPage(),
            ];
        }

        return response()->json($payload, $status, $headers);
    }

    /**
     * Send a created (201) JSON response.
     */
    public static function created(mixed $data = null, ?string $message = null): JsonResponse
    {
        return self::success($data, $message, Response::HTTP_CREATED);
    }

    /**
     * Send a no-content (204) JSON response.
     */
    public static function noContent(): JsonResponse
    {
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * Send a generic error JSON response.
     *
     * @param  array<string,mixed>  $errors
     * @param  array<string,mixed>  $headers
     */
    public static function error(
        string $message,
        int $status = Response::HTTP_BAD_REQUEST,
        array $errors = [],
        array $headers = [],
    ): JsonResponse {
        $payload = ['message' => $message];

        if ($errors !== []) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $status, $headers);
    }

    /**
     * Send a 422 validation error JSON response.
     *
     * @param  array<string,array<int,string>>  $errors
     */
    public static function validation(array $errors, ?string $message = null): JsonResponse
    {
        return self::error(
            $message ?: 'The given data was invalid.',
            Response::HTTP_UNPROCESSABLE_ENTITY,
            $errors,
        );
    }

    private static function normalize(mixed $data): mixed
    {
        if ($data instanceof JsonResource || $data instanceof ResourceCollection) {
            return $data;
        }

        if ($data instanceof Arrayable) {
            return $data->toArray();
        }

        return $data;
    }
}
