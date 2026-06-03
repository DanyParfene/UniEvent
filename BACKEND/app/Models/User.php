<?php

namespace App\Models;

use App\Notifications\ResetPasswordTokenNotification;
use App\Support\Contracts\AuthenticatedUser;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements JWTSubject, AuthenticatedUser
{
    use CanResetPassword;
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;
    use HasRoles;
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'department',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPasswordTokenNotification($token));
    }

    // Explicit override required: Illuminate\Auth\Authenticatable::getAuthIdentifier() has no
    // return type declaration, which is incompatible with AuthenticatedUser::getAuthIdentifier(): mixed
    // in PHP 8.x strict mode. Delegating to parent keeps the original behaviour.
    public function getAuthIdentifier(): mixed
    {
        return parent::getAuthIdentifier();
    }

    // Spatie Permission v6 uses getDefaultGuardName() internally when resolving
    // roles via findByName() / assignRole() / syncRoles(). Roles are seeded as
    // guard_name = 'web'. Pinning this prevents the auth.defaults.guard = 'api'
    // change from causing Spatie to look for roles that don't exist.
    // RoleAuthMiddleware reads the role from JWT claims directly, so the stored
    // guard name has zero effect on authorization.
    protected function getDefaultGuardName(): string
    {
        return 'web';
    }

    // JWTSubject contract
    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [
            'role'       => $this->roles->first()?->name,
            'department' => $this->department,
            'email'      => $this->email,
        ];
    }
}
