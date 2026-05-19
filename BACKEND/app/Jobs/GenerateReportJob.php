<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Mail\EventReportMail;
use App\Models\User;
use App\Services\Report\ReportDatasetResolver;
use App\Services\Report\ReportPdfRenderer;
use App\Services\Report\ReportStorageService;
use App\Support\Report\ReportGenerationInput;
use App\Support\Report\ReportType;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class GenerateReportJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 120;

    /**
     * @param  array<string, mixed>  $inputData
     */
    public function __construct(
        public readonly array $inputData,
    ) {}

    public function handle(
        ReportDatasetResolver $resolver,
        ReportPdfRenderer $renderer,
        ReportStorageService $storage,
    ): void {
        $input = ReportGenerationInput::fromArray($this->inputData);
        $user = User::query()->findOrFail($input->userId);

        $dataset = $resolver->resolve($user, $input);
        $pdfBinary = $renderer->render($dataset);
        $path = $storage->store($pdfBinary, $user->id);

        $title = $dataset->reportTitle ?? ($dataset->type === ReportType::Partner
            ? 'Raport parteneri'
            : 'Raport evenimente');

        Mail::to($user->email)->send(new EventReportMail($title, $path));
    }

    public function failed(?Throwable $exception): void
    {
        Log::error('Report generation failed', [
            'user_id' => $this->inputData['user_id'] ?? null,
            'message' => $exception?->getMessage(),
        ]);
    }
}
