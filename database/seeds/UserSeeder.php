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
        $user = User::create([
            'name' => 'poop',
            'email' => 'poop@gmail.com',
            'password' => bcrypt('12341234')
        ]);
        $user->save();
    }
}
