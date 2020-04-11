<?php

use Illuminate\Database\Seeder;
use \App\User;
use \App\Painting;

class PaintingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = \App\User::find('1');
        $p = $user->paintings()->create();
        $p->save();
    }
}
