<?php

namespace App\Http\Controllers;

use App\User;
use App\Permission;
use App\Painting;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function getPaintings(User $user)
    {
        if (Auth::id() === $user->id) {
            return response()->json($user->paintings);
        }
        return response("Not authorized to view user's posts", 401);
    }

    public function getShared(User $user)
    {
        if (Auth::id() === $user->id) {
            $shared_ids = Permission::where('user_id', $user->id)->get()->pluck('painting_id')->toArray();
            $shared_paintings = Painting::whereIn('id', $shared_ids);
            return response()->json($shared_paintings);
        }
        return response("Not authorized to view user's posts", 401);
    }
}
