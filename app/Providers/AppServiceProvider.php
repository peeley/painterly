<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\PaintingUpdateService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(PaintingUpdateService::class, function ($app) {
            return new PaintingUpdateService();
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
