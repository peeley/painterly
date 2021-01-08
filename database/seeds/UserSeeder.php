<?php

use Illuminate\Database\Seeder;
use \App\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = User::firstOrCreate(
            ['email' => 'admin@email.com'],
            ['name' => 'admin',
            'password' => bcrypt('12341234')]
        );
        $user->save();

        $user2 = User::firstOrCreate(
            ['email' => 'other@email.com'],
            ['name' => 'other',
            'password' => bcrypt('12341234')]
        );
        $user2->save();
    }
}
