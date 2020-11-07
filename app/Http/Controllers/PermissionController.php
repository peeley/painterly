<?php

namespace App\Http\Controllers;

use \App\Http\Requests\PermissionRequest;
use \App\Painting;
use \App\User;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function getPermissions(Painting $painting)
    {
        $this->authorize('view', $painting);
        return response()->json($painting->permissions);
    }
    public function addPermission(PermissionRequest $request, Painting $painting)
    {
        $this->authorize('editPermissions', $painting);
        $validated = $request->validated();
        $perms = $validated['perms'];
        $email = $validated['email'];
        $user = User::where('email', $email)->first();
        $newPerm = $painting->share($user, $perms);
        return response()->json($newPerm);

        // TODO notify user when added to painting
    }
    public function removeUser(Painting $painting, User $user)
    {
        $this->authorize('editPermissions', $painting);
        $painting->permissions->where('user_id', $user->id)->first()->delete();
        return response('Permission removed', 200);
    }
    public function editPublicPermissions(Request $request, Painting $painting)
    {
        $validated = $request->validate([
            'view_public' => 'boolean',
            'edit_public' => 'boolean',
        ]);
        $painting->view_public = $validated['view_public'];
        $painting->edit_public = $validated['edit_public'];
        $painting->save();
        return response('OK', 200);
    }
}
