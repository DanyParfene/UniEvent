<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\Models\User;
use App\Support\RoleName;

final class RegisterUserAction
{
    /**
     * @return array{user: User, token: string}
     */
    public function execute(string $name, string $email, string $password, string $department): array
    {
        $user = User::query()->create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'department' => $department,
        ]);

        $user->assignRole(RoleName::COORDINATOR);
        $user->load('roles');

        $token = $user->createToken('api')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }
}
