<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Actions\User\ListUsersAction;
use App\Actions\User\UpdateUserRoleAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\IndexUsersRequest;
use App\Http\Requests\User\UpdateUserRoleRequest;
use App\Http\Resources\UserAdminResource;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function index(IndexUsersRequest $request, ListUsersAction $action): JsonResponse
    {
        $users = $action->execute();

        return ApiResponse::success([
            'users' => $users
                ->map(fn (User $user) => (new UserAdminResource($user))->toArray($request))
                ->values()
                ->all(),
        ]);
    }

    public function updateRole(
        UpdateUserRoleRequest $request,
        User $user,
        UpdateUserRoleAction $action,
    ): JsonResponse {
        $updated = $action->execute(
            $user,
            $request->validated('role_name'),
            $request->user(),
        );

        return ApiResponse::success(
            (new UserAdminResource($updated))->toArray($request),
            'User role updated successfully.',
        );
    }
}
