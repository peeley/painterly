<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function getPaintings(User $user){
        if(Auth::id() === $user->id){
            return response()->json($user->paintings);
        }
        return response("Not authorized to view user's posts", 401);
    }
}
