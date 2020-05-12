<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Gate::define('edit-painting', function($user, $painting) {
            if($user->id === $painting->user_id){
                return true;
            }
            foreach($painting->permissions as $perm){
                if($perm->user_id === $user->id && 
                        $perm->painting_id === $painting->id){
                    return $perm->permissions === 'read_write';
                }
            }
            return false;
        });
        Gate::define('view-painting', function($user, $painting) {
            if(!$painting->view_private){
                return true;
            }
            else if($user){
                if($painting->user_id === $user->id){
                    return true;
                }
                foreach($painting->permissions as $perm){
                    if($perm->user_id === $user->id && $perm->permissions){
                        return true;
                    }
                }
            }
            return false;
        });
        Gate::define('edit-permissions', function($user, $painting) {
            return $user->id === $painting->user_id;
        });
    }
}
