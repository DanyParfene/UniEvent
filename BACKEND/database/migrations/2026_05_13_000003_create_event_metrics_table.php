<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_metrics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('event_id')->constrained('events')->cascadeOnDelete();
            $table->enum('category', [
                'album_foto',
                'facebook',
                'instagram',
                'tiktok',
                'comunicat_presa',
                'aparitii_presa',
                'statistici',
                'podcast',
            ]);
            $table->string('link');
            $table->unsignedInteger('reach')->default(0);
            $table->unsignedInteger('engagement')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_metrics');
    }
};
