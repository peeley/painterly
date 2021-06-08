<?php

namespace App\Http\Controllers;

use App\Models\User;
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
            $shared_paintings = $user->shared()->get();
            return response()->json($shared_paintings);
        }
        return response("Not authorized to view user's posts", 401);
    }
}
