<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->numerify('09########'),
            'password' => Hash::make('password123'),
            'role' => UserRole::Patient,
            'status' => UserStatus::Active,
        ];
    }

    public function admin(): static
    {
        return $this->state(fn () => ['role' => UserRole::Admin]);
    }

    public function doctor(): static
    {
        return $this->state(fn () => ['role' => UserRole::Doctor]);
    }

    public function technician(): static
    {
        return $this->state(fn () => ['role' => UserRole::Technician]);
    }

    public function reception(): static
    {
        return $this->state(fn () => ['role' => UserRole::Reception]);
    }

    public function patient(): static
    {
        return $this->state(fn () => ['role' => UserRole::Patient]);
    }

    public function pending(): static
    {
        return $this->state(fn () => ['status' => UserStatus::Pending]);
    }

    public function blocked(): static
    {
        return $this->state(fn () => ['status' => UserStatus::Blocked]);
    }
}
