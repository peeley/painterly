<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use \App\Painting;

class PaintingController extends Controller
{
    public function index(){
        $user = Auth::user();
        $painting = $user->paintings()->create();
        return redirect("/painting/{$painting->id}");
    }
    
    public function show(\App\Painting $painting){
        return view('app', ['title' => $painting->title]);
    }
    public function getStrokes(\App\Painting $painting){
        return $painting;
    }
    public function editStrokes(Request $request, \App\Painting $painting){
        if(!Auth::check()){
            return response('Not Logged In', 401);
        }
        Gate::authorize('edit-painting', $painting);
        $painting->strokes = json_decode($request->getContent());
        $painting->save();
        return response()->json($painting->strokes);
    }
}
