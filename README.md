# Laravel Identifier Package :: simple authentication
[![Latest Version on Packagist](https://img.shields.io/packagist/v/sinarajabpour1998/identifier.svg?style=flat-square)](https://packagist.org/packages/sinarajabpour1998/identifier)
[![GitHub issues](https://img.shields.io/github/issues/sinarajabpour1998/identifier?style=flat-square)](https://github.com/sinarajabpour1998/identifier/issues)
[![GitHub stars](https://img.shields.io/github/stars/sinarajabpour1998/identifier?style=flat-square)](https://github.com/sinarajabpour1998/identifier/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/sinarajabpour1998/identifier?style=flat-square)](https://github.com/sinarajabpour1998/identifier/network)
[![Total Downloads](https://img.shields.io/packagist/dt/sinarajabpour1998/identifier.svg?style=flat-square)](https://packagist.org/packages/sinarajabpour1998/identifier)
[![GitHub license](https://img.shields.io/github/license/sinarajabpour1998/identifier?style=flat-square)](https://github.com/sinarajabpour1998/identifier/blob/master/LICENSE)

Laravel Identifier Package :: simple authentication (login, register and forgot-password).

## How to install and config [sinarajabpour1998/identifier](https://github.com/sinarajabpour1998/identifier) package?

#### <g-emoji class="g-emoji" alias="arrow_down" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2b07.png">⬇️</g-emoji> Installation

```bash
composer require sinarajabpour1998/identifier
```

#### Publish Config file

```bash
php artisan vendor:publish --tag=identifier
```

- Update (Be careful! Overwrites existing settings)

```bash
php artisan vendor:publish --tag=identifier --force
```

#### Migrate tables, to add identifier tables to database

```bash
php artisan migrate
```

#### <g-emoji class="g-emoji" alias="book" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f4d6.png">📖</g-emoji> How to change auth options

- Set the configs in /config/identifier.php

## Usage

- Create resources/sass/auth.scss file and add the following code :

```scss
// Fonts
@import './fonts/awesome/awesome-font.css';
@import './fonts/iransans/iransans-font.css';

@import "./vendor/identifier/identifier.scss";
```

* Please note that fonts directories is up to your project structure. change them with your own directories.

- Create resources/js/auth.js file and add the following code :

```js
require('./bootstrap');

require("./vendor/identifier/identifier");
```

- Add created files directly in your webpack.mix.js

```bash
.js('resources/js/auth.js', 'public/js')
    .sass('resources/sass/auth.scss', 'public/css')
```

- run npm :

```bash
npm run dev
```

- Use this route to redirect your users to login and registration page

```php
route('identifier.login');
```

- Change `app/Http/Middleware/Authenticate.php` like this :

```php
protected function redirectTo($request)
{
    if (! $request->expectsJson()) {
        return route('identifier.login');
    }
}
```

- Clear caches

```bash
php artisan cache:clear
php artisan view:clear
php artisan route:clear
php artisan config:clear
```

- Done !

###Features :

- Dynamic site name and terms url (change via config file)
* configuration :
```php
    return[
    // other codes ...
    
    // the title of site (this will be used in title and help titles)
    'site_title' => env('APP_NAME', 'پیش فرض'),

    // full url of terms page (this will be used in register page)
    'terms_url' => 'https://test.com/',
    
    // other codes ...
    ];
```

- Dynamic redirect url after login for separate admins and users (change via config file)
* configuration :
```php
    return[
    // other codes ...
    
    // admin login redirect route name
    'admin_login_redirect' => 'admin',

    // user login redirect route name
    'user_login_redirect' => 'home',
    
    // other codes ...
    ];
```

- Dynamic css and js path
* configuration :
You can change anything in published sass and js files and move them into 
  desired location, then you can change the files' location in config file
  
```php
    return[
    // other codes ...
    
    // where did you required the identifier.scss file ?
    // this file must be included in webpack.js as well
    'css_public_path' => 'css/auth.css',

    // where did you required the identifier.js file ?
    // this file must be included in webpack.js as well
    'js_public_path' => 'js/auth.js',
    
    // other codes ...
    ];
```

- OTP code length
* configuration :
```php
    return[
    // other codes ...
    
    // OTP codes digit, by default it's 6-digit (secure and standard)
    'otp_digit' => 6,
    
    // other codes ...
    ];
```
  
- Redirect users to specific location after login , registration or account recovery by url (New feature since 1.3 release)
* usage :
```bash
https://example.com/auth/default?back=https://example.com/cart/confirm
```

###Requirements :

- PHP v7.0 or above
- Laravel v7.0 or above
- sinarajabpour1998/notifier package [packagist link](https://packagist.org/packages/sinarajabpour1998/notifier)
- va/cutlet-helper package [packagist link](https://packagist.org/packages/va/cutlet-helper)