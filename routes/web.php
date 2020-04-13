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
Route::post('/painting', 'PaintingController@index')->middleware('auth');
Route::get('/painting/{painting}', 'PaintingController@show')->middleware('auth');
Route::get('/api/p/{painting}', 'PaintingController@getStrokes');
Route::post('/api/p/{painting}', 'PaintingController@editStrokes')->middleware('auth');
Route::delete('/api/p/{painting}', 'PaintingController@deletePainting')->middleware('auth');
