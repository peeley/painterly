<?php

namespace App\Policies;

use App\User;
use App\Painting;
use Illuminate\Auth\Access\HandlesAuthorization;

class PaintingPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function update(User $user, Painting $painting)
    {
        if ($user->id === $painting->user_id || $painting->edit_public) {
            return true;
        }
        foreach ($painting->permissions as $perm) {
            if (
                $perm->user_id === $user->id &&
                $perm->painting_id === $painting->id
            ) {
                return $perm->permissions === 'read_write';
            }
        }
        return false;
    }

    // Defines whether user can GET painting as JSON
    public function view(User $user, Painting $painting)
    {
        if ($painting->view_public) {
            return true;
        } else if ($user) {
            if ($painting->user_id === $user->id) {
                return true;
            }
            foreach ($painting->permissions as $perm) {
                if ($perm->user_id === $user->id && $perm->permissions) {
                    return true;
                }
            }
        }
        return false;
    }

    public function edit(User $user, Painting $painting)
    {
        return $user->id === $painting->user_id;
    }
}
