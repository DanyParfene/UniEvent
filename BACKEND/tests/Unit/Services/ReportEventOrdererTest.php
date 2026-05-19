<?php

declare(strict_types=1);

namespace Tests\Unit\Services;

use App\Models\Event;
use App\Services\Report\ReportEventOrderer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportEventOrdererTest extends TestCase
{
    use RefreshDatabase;

    public function test_order_by_ids_preserves_request_order(): void
    {
        $first = Event::factory()->create();
        $second = Event::factory()->create();
        $third = Event::factory()->create();

        $orderer = new ReportEventOrderer;
        $ordered = $orderer->orderByIds(
            [$third->id, $first->id, $second->id],
            Event::query()->whereIn('id', [$first->id, $second->id, $third->id])->get(),
        );

        $this->assertSame(
            [$third->id, $first->id, $second->id],
            array_map(fn (Event $event) => $event->id, $ordered),
        );
    }
}
