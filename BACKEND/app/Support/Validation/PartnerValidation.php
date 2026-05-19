<?php

declare(strict_types=1);

namespace App\Support\Validation;

use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Exists;

final class PartnerValidation
{
    public static function activePartnerIdExists(): Exists
    {
        return Rule::exists('partners', 'id')->whereNull('deleted_at');
    }
}
