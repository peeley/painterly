<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use \App\Painting;
use \App\User;

class PermissionController extends Controller
{
    public function getPermissions(Painting $painting){
        return response()->json($painting->permissions);
    }
    public function addUser(Request $request, Painting $painting){
        Gate::authorize('edit-permissions', $painting);
        $perms = $request->query('perms');
        if(!($perms === 'read' || $perms === 'read_write')){
            return response('Invalid permissions', 422);
        }
        $email = $request->query('email');
        $user = User::where('email', $email)->first();
        if(!$user){
            return response("No matching user with email $email", 404);
        }
        $newPerm = $painting->permissions()->firstOrCreate(
            ['user_id' => $user->id],
            ['permissions' => $perms, 'user_email' => $email]
        );
        return response()->json($newPerm);

        // TODO notify user when added to painting
    }
    public function removeUser(Painting $painting, User $user){
        Gate::authorize('edit-permissions', $painting);
        $painting->permissions->where('user_id', $user->id)->first()->delete();
        return response('Permission removed', 200);
    }
}
