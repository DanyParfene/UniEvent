<?php

namespace Database\Seeders;

use App\Models\User;
use App\Support\RoleName;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        $coordinator = User::query()->updateOrCreate(
            ['email' => 'test.user@e-uvt.ro'],
            [
                'name' => 'Test User',
                'department' => 'Demo Department',
                'password' => Hash::make('password'),
            ],
        );

        $coordinator->syncRoles([RoleName::COORDINATOR]);

        $superAdmin = User::query()->updateOrCreate(
            ['email' => 'admin.user@e-uvt.ro'],
            [
                'name' => 'Demo Super Admin',
                'department' => 'Platform Administration',
                'password' => Hash::make('password'),
            ],
        );

        $superAdmin->syncRoles([RoleName::SUPER_ADMINISTRATOR]);
    }
}
