<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('department');
            $table->string('name');
            $table->string('banner_url');
            $table->date('start_date');
            $table->date('finish_date');
            $table->unsignedInteger('edition')->default(1);
            $table->string('organizer');
            $table->text('description');
            $table->string('location');
            $table->json('guests')->nullable();
            $table->enum('mode', ['physical', 'hybrid', 'online']);
            $table->unsignedInteger('estimated_participants')->default(0);
            $table->string('target_group');
            $table->enum('has_livestream', ['YES', 'NO'])->default('NO');
            $table->string('coordinator_name');
            $table->string('coordinator_email');
            $table->string('coordinator_phone');
            $table->text('additional_info')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
