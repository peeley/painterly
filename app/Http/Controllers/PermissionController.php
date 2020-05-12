<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function addUser(\App\Painting $painting, \App\User $user, string $perms){
        Gate::authorize('edit-permissions', $painting);
        $newPerm = $painting->permissions->firstOrCreate(
            ['user_id' => $user->id],
            ['permissions' => $perms]
        );
        return response()->json($newPerm);
    }
    public function removeUser(\App\Painting $painting, \App\User $user){
        Gate::authorize('edit-permissions', $painting);
        // TODO : remove a row in permissions table w/ user and painting and permissions
    }
}
