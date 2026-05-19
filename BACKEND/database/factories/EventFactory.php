<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\EventHasLivestream;
use App\Enums\EventMode;
use App\Enums\EventStatus;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Event>
 */
class EventFactory extends Factory
{
    protected $model = Event::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('+1 week', '+2 months');

        return [
            'department' => fake()->company(),
            'name' => fake()->sentence(3),
            'banner_url' => fake()->url(),
            'start_date' => $start->format('Y-m-d'),
            'finish_date' => fake()->dateTimeBetween($start, '+3 months')->format('Y-m-d'),
            'edition' => 1,
            'organizer' => fake()->company(),
            'description' => fake()->paragraph(),
            'location' => fake()->city(),
            'guests' => null,
            'mode' => EventMode::Physical->value,
            'estimated_participants' => fake()->numberBetween(50, 500),
            'target_group' => 'Studenți',
            'has_livestream' => EventHasLivestream::NO->value,
            'coordinator_name' => fake()->name(),
            'coordinator_email' => fake()->unique()->userName().'@e-uvt.ro',
            'coordinator_phone' => '+40700000000',
            'additional_info' => null,
            'status' => EventStatus::Published->value,
        ];
    }

    public function archived(): static
    {
        return $this->state(fn () => ['status' => EventStatus::Archived->value]);
    }

    public function forCoordinator(string $email, ?string $department = null): static
    {
        return $this->state(fn () => [
            'coordinator_email' => $email,
            'department' => $department ?? fake()->company(),
        ]);
    }
}
