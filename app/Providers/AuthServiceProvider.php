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
        'App\Painting' => 'App\Policies\PaintingPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Gate::define('edit-painting', 'PaintingPolicy@update');
        Gate::define('view-painting', 'PaintingPolicy@view');
        Gate::define('edit-permissions', 'PaintingPolicy@edit');
    }
}
