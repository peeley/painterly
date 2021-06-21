<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    if (Auth::check()) {
        return redirect('/home');
    } else {
        return redirect('/login');
    }
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::get('/painting/{painting}', 'PaintingController@index')->middleware('auth');

// putting API routes in ./web.php instead of ./api.php, since requests come
// from user browser and we use session for authentication
Route::prefix('api')->group(function () {
    Route::middleware(['auth'])->group(function () {
        Route::prefix('/p')->group(function () {
            Route::post('/', 'PaintingController@createPainting');
            Route::get('/{painting}', 'PaintingController@getPainting');
            Route::put('/{painting}', 'PaintingController@putPainting');
            Route::post('/{painting}/title', 'PaintingController@postTitle');
            Route::post('/{painting}/preview', 'PaintingController@postPreview');
            Route::delete('/{painting}', 'PaintingController@deletePainting');

            Route::get('/{painting}/perms', 'PermissionController@getPermissions');
            Route::post('/{painting}/perms', 'PermissionController@addPermission');
            Route::put('/{painting}/perms', 'PermissionController@editPublicPermissions');
            Route::delete('/{painting}/perms/{user}', 'PermissionController@removeUser');
        });

        Route::prefix('/u')->group(function () {
            Route::get('/{user}/paintings', 'UserController@getPaintings');
            Route::get('/{user}/shared', 'UserController@getShared');
        });
    });
});
