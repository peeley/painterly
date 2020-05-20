<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Auth\Middleware\Authenticate;

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
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::get('/painting/{painting}', 'PaintingController@show')->middleware('auth');
Route::post('/api/p', 'PaintingController@createPainting')->middleware('auth');
Route::get('/api/p/{painting}', 'PaintingController@getPainting');
Route::put('/api/p/{painting}', 'PaintingController@putPainting')->middleware('auth');
Route::delete('/api/p/{painting}', 'PaintingController@deletePainting')->middleware('auth');

Route::get('/api/p/{painting}/perms', 'PermissionController@getPermissions')->middleware('auth');
Route::post('/api/p/{painting}/perms/{user}', 'PermissionController@addUser')->middleware('auth');
Route::delete('/api/p/{painting}/perms/{user}', 'PermissionController@removeUser')->middleware('auth');

Route::get('/api/u/{user}/paintings', 'UserController@getPaintings')->middleware('auth');
