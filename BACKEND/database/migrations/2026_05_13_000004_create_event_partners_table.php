<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_partners', function (Blueprint $table) {
            $table->foreignUuid('event_id')->constrained('events')->cascadeOnDelete();
            $table->foreignUuid('partner_id')->constrained('partners')->cascadeOnDelete();
            $table->timestamps();

            $table->primary(['event_id', 'partner_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_partners');
    }
};
