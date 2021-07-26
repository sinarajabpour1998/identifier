<?php

namespace Sinarajabpour1998\Identifier;

use Sinarajabpour1998\Identifier\Facades\IdentifierLoginFacade;
use Sinarajabpour1998\Identifier\Repositories\IdentifierLoginRepository;
use Sinarajabpour1998\Identifier\View\Components\LoginComponent;
use Illuminate\Support\ServiceProvider;

class IdentifierServiceProvider extends ServiceProvider
{
    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        IdentifierLoginFacade::shouldProxyTo(IdentifierLoginRepository::class);
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
     public function boot()
     {
         $this->loadRoutesFrom(__DIR__ . '/routes/web.php');
         $this->loadViewsFrom(__DIR__ . '/views','identifier');
         $this->loadMigrationsFrom(__DIR__ . '/database/migrations');
         $this->mergeConfigFrom(__DIR__ . '/config/identifier.php', 'identifier');
         $this->publishes([
             __DIR__.'/config/identifier.php' =>config_path('identifier.php'),
             __DIR__.'/views/' => resource_path('views/vendor/identifier'),
             __DIR__.'/assets/js/' => resource_path('js/vendor/identifier'),
             __DIR__.'/assets/sass/' => resource_path('sass/vendor/identifier'),
         ], 'identifier');

         $this->loadViewComponentsAs('', [
             LoginComponent::class
         ]);
     }
}
