<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use \App\Painting;
use \App\User;

class PermissionController extends Controller
{
    public function getPermissions(Painting $painting){
        return $painting->permissions;
    }
    public function addUser(Request $request, Painting $painting, User $user){
        Gate::authorize('edit-permissions', $painting);
        $perms = $request->query('perms');
        if(!($perms === 'read' && $perms === 'read_write')){
            return response('Invalid permissions', 422);
        }
        // TODO add validation for perms string
        $newPerm = $painting->permissions->firstOrCreate(
            ['user_id' => $user->id],
            ['permissions' => $perms]
        );
        return response()->json($newPerm);
    }
    public function removeUser(Painting $painting, User $user){
        Gate::authorize('edit-permissions', $painting);
        $painting->permissions->where('user_id', $user->id)->delete();
        return response('Permission removed', 200);
    }
}
