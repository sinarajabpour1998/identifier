<?php
use Illuminate\Support\Facades\Route;

Route::group([
    'namespace'  => 'Sinarajabpour1998\Identifier\Http\Controllers',
    'prefix'     => 'auth',
    'middleware' => ['web', 'guest']
], function () {
    Route::get('/{page?}', 'LoginController@show')->name('identifier.login')->middleware('throttle:120,1,identifierLogin');
    Route::post('/send/code', 'LoginController@sendCode')->name('identifier.send.code')->middleware('throttle:20,1,identifierSendCode');
    Route::post('/confirm/code', 'LoginController@confirmCode')->name('identifier.confirm.code')->middleware('throttle:20,1,identifierConfirmCode');
    Route::post('/check/mobile', 'LoginController@checkMobile')->name('identifier.check.mobile')->middleware('throttle:50,1,identifierCheckMobile');
    Route::post('/logout', 'LoginController@logout')->name('identifier.logout')->withoutMiddleware('guest');
    Route::post('/check/username', 'LoginController@checkUsername')->name('identifier.check.username')->middleware('throttle:50,1,identifierCheckUsername');
    Route::post('/confirm/recovery', 'LoginController@confirmRecoveryCode')->name('identifier.confirm.recovery.code')->middleware('throttle:20,1,identifierConfirmRecoveryCode');
    Route::post('/change/password', 'LoginController@changePassword')->name('identifier.change.password')->middleware('throttle:50,1,identifierChangePassword');
    Route::post('/login/password', 'LoginController@loginWithPassword')->name('identifier.login.password')->middleware('throttle:20,1,identifierLoginPassword');

    Route::post('/check/registered/user', 'LoginController@checkRegisteredUser')->name('identifier.check.registered.user')->middleware('throttle:50,1,identifierCheckRegisteredUser');
    Route::post('/confirm/email/code', 'LoginController@confirmEmailCode')->name('identifier.confirm.email.code')->middleware('throttle:20,1,identifierConfirmEmailCode');
});
