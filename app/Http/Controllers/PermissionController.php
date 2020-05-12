<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Painting;
use \App\User;

class PermissionController extends Controller
{
    public function addUser(Request $request, Painting $painting, User $user){
        Gate::authorize('edit-permissions', $painting);
        // TODO add validation for perms string
        $newPerm = $painting->permissions->firstOrCreate(
            ['user_id' => $user->id],
            ['permissions' => $request->query('perms')]
        );
        return response()->json($newPerm);
    }
    public function removeUser(Painting $painting, User $user){
        Gate::authorize('edit-permissions', $painting);
        $painting->permissions->where('user_id', $user->id)->delete();
        return response('Permission removed', 200);
    }
}
