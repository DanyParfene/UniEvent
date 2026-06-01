<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\Department;
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
            'department' => fake()->randomElement(Department::all()),
            'event_name' => fake()->sentence(3),
            'banner' => fake()->url(),
            'start_event_date' => $start->format('Y-m-d'),
            'finish_event_date' => fake()->dateTimeBetween($start, '+3 months')->format('Y-m-d'),
            'edition' => 1,
            'organizer' => fake()->company(),
            'description' => fake()->paragraph(),
            'location' => fake()->city(),
            'invitations' => null,
            'organization_mode' => EventMode::Physical->value,
            'number_of_participants' => fake()->numberBetween(50, 500),
            'target_group' => 'Studenți',
            'livestream' => EventHasLivestream::NO->value,
            'coordinator' => fake()->name(),
            'email' => fake()->unique()->userName().'@e-uvt.ro',
            'telephone' => '+40700000000',
            'other_information' => null,
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
            'email' => $email,
            'department' => $department ?? fake()->randomElement(Department::all()),
        ]);
    }
}
