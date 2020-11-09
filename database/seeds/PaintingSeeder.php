<?php

use Illuminate\Database\Seeder;
use App\User;

class PaintingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = User::where(['email' => 'poop@gmail.com'])->first();
        $p = $user->paintings()->create();
        $p->save();

        $other_user = User::where(['email' => 'other@gmail.com'])->first();
        $p2 = $other_user->paintings()->create();
        $p2->share($user, 'read_write');
        $p2->save();
    }
}
