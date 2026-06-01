<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Actions\Auth\ChangePasswordAction;
use App\Actions\Auth\LoginUserAction;
use App\Actions\Auth\LogoutUserAction;
use App\Actions\Auth\RefreshTokenAction;
use App\Actions\Auth\RegisterUserAction;
use App\Actions\Auth\ResetPasswordAction;
use App\Actions\Auth\SendPasswordResetLinkAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginAuthRequest;
use App\Http\Requests\Auth\RegisterAuthRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\Auth\JwtTokenService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function register(
        RegisterAuthRequest $request,
        RegisterUserAction $action,
        JwtTokenService $tokenService,
    ): JsonResponse {
        $validated = $request->validated();
        $result = $action->execute(
            $validated['name'],
            $validated['email'],
            $validated['password'],
            $validated['department'],
        );

        return ApiResponse::created([
            'user'         => (new UserResource($result['user']))->toArray($request),
            'access_token' => $result['access_token'],
            'token_type'   => 'Bearer',
        ], 'Registration successful.')
            ->withCookie($tokenService->buildRefreshCookie($result['refresh_token']));
    }

    public function login(
        LoginAuthRequest $request,
        LoginUserAction $action,
        JwtTokenService $tokenService,
    ): JsonResponse {
        $validated = $request->validated();
        $result = $action->execute($validated['email'], $validated['password']);

        if ($result === null) {
            return ApiResponse::error(__('auth.failed'), Response::HTTP_UNAUTHORIZED);
        }

        return ApiResponse::success([
            'user'         => (new UserResource($result['user']))->toArray($request),
            'access_token' => $result['access_token'],
            'token_type'   => 'Bearer',
        ], 'Login successful.')
            ->withCookie($tokenService->buildRefreshCookie($result['refresh_token']));
    }

    public function logout(
        Request $request,
        LogoutUserAction $action,
        JwtTokenService $tokenService,
    ): JsonResponse {
        $action->execute($request->user());

        return ApiResponse::noContent()
            ->withCookie($tokenService->buildExpiredRefreshCookie());
    }

    public function refresh(
        Request $request,
        RefreshTokenAction $action,
        JwtTokenService $tokenService,
    ): JsonResponse {
        $cookieToken = $request->cookie('refresh_token');

        if (! is_string($cookieToken) || $cookieToken === '') {
            return ApiResponse::error('No refresh token provided.', Response::HTTP_UNAUTHORIZED);
        }

        $result = $action->execute($cookieToken);

        if ($result === null) {
            return ApiResponse::error('Session invalidated for security. Please log in again.', Response::HTTP_UNAUTHORIZED)
                ->withCookie($tokenService->buildExpiredRefreshCookie());
        }

        return ApiResponse::success([
            'user'         => (new UserResource($result['user']))->toArray($request),
            'access_token' => $result['access_token'],
            'token_type'   => 'Bearer',
        ], 'Token refreshed.')
            ->withCookie($tokenService->buildRefreshCookie($result['refresh_token']));
    }

    public function forgotPassword(ForgotPasswordRequest $request, SendPasswordResetLinkAction $action): JsonResponse
    {
        $status = $action->execute($request->validated('email'));

        if ($status === Password::RESET_THROTTLED) {
            return ApiResponse::error(__($status), Response::HTTP_TOO_MANY_REQUESTS);
        }

        return ApiResponse::success(
            null,
            'If an account exists for this email, password reset instructions have been sent.',
        );
    }

    public function resetPassword(ResetPasswordRequest $request, ResetPasswordAction $action): JsonResponse
    {
        $validated = $request->validated();
        $status = $action->execute(
            $validated['email'],
            $validated['email_token'],
            $validated['new_password'],
        );

        if ($status !== Password::PASSWORD_RESET) {
            return ApiResponse::error(__($status), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return ApiResponse::success(null, __($status));
    }

    public function changePassword(ChangePasswordRequest $request, ChangePasswordAction $action): JsonResponse
    {
        $validated = $request->validated();

        // Load Eloquent User from DB — DTO cannot call save()
        $user = User::findOrFail($request->user()->getAuthIdentifier());

        $action->execute($user, $validated['old_password'], $validated['new_password']);

        return ApiResponse::success(null, 'Password updated successfully.');
    }
}
