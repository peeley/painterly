<?php

namespace Database\Seeders;

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
        $user = User::where(['email' => 'admin@email.com'])->first();
        $p = $user->paintings()->firstOrCreate([]);
        $p->save();

        $other_user = User::where(['email' => 'other@email.com'])->first();
        $p2 = $other_user->paintings()->firstOrCreate([]);
        $p2->share($user, 'read_write');
        $p2->save();
    }
}
