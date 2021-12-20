<?php
use Illuminate\Support\Facades\Route;

Route::group([
    'namespace'  => 'Sinarajabpour1998\Identifier\Http\Controllers',
    'prefix'     => 'auth',
    'middleware' => ['web', 'guest']
], function () {
    Route::get('/{page?}', 'LoginController@show')->name('identifier.login');
    Route::post('/send/code', 'LoginController@sendCode')->name('identifier.send.code');
    Route::post('/confirm/code', 'LoginController@confirmCode')->name('identifier.confirm.code');
    Route::post('/check/mobile', 'LoginController@checkMobile')->name('identifier.check.mobile');
    Route::post('/logout', 'LoginController@logout')->name('identifier.logout')->withoutMiddleware('guest');
    Route::post('/check/username', 'LoginController@checkUsername')->name('identifier.check.username');
    Route::post('/confirm/recovery', 'LoginController@confirmRecoveryCode')->name('identifier.confirm.recovery.code');
    Route::post('/change/password', 'LoginController@changePassword')->name('identifier.change.password');
    Route::post('/login/password', 'LoginController@loginWithPassword')->name('identifier.login.password');

    Route::post('/check/registered/user', 'LoginController@checkRegisteredUser')->name('identifier.check.registered.user');
    Route::post('/confirm/email/code', 'LoginController@confirmEmailCode')->name('identifier.confirm.email.code');
});
