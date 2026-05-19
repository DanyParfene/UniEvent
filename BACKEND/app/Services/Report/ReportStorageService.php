<?php

declare(strict_types=1);

namespace App\Services\Report;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class ReportStorageService
{
    private const DISK = 'local';

    private const DIRECTORY = 'reports';

    public function store(string $pdfBinary, int $userId): string
    {
        $filename = sprintf(
            '%s/user-%d-%s.pdf',
            self::DIRECTORY,
            $userId,
            Str::uuid()->toString(),
        );

        Storage::disk(self::DISK)->put($filename, $pdfBinary);

        return $filename;
    }

    public function absolutePath(string $storagePath): string
    {
        return Storage::disk(self::DISK)->path($storagePath);
    }
}
