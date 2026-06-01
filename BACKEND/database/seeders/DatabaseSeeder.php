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

        $superAdmin = User::query()->updateOrCreate(
            ['email' => 'admin.user@e-uvt.ro'],
            [
                'name' => 'Demo Super Admin',
                'department' => 'INFO',
                'password' => Hash::make('password'),
            ],
        );

        $superAdmin->syncRoles([RoleName::SUPER_ADMINISTRATOR]);
    }
}
