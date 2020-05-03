<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use \App\Painting;

class PaintingController extends Controller
{
    public function index(){
        $user = Auth::user();
        $painting = $user->paintings()->create();
        return redirect("/painting/{$painting->id}");
    }
    
    public function show(\App\Painting $painting){
        Gate::authorize('view-painting', $painting);
        return view('app', ['title' => $painting->title]);
    }
    public function getPainting(\App\Painting $painting){
        return $painting;
    }
    public function putPainting(Request $request, \App\Painting $painting){
        if(!Auth::check()){
            return response('Not Logged In', 401);
        }
        Gate::authorize('edit-painting', $painting);
        $painting->strokes = $request->input('strokes', $painting->strokes); 
        $painting->title = $request->input('title', $painting->title); 
        $painting->view_public = $request->input('view_public', $painting->view_public); 
        $painting->edit_public = $request->input('edit_public', $painting->edit_public); 
        $painting->save();
        return response()->json($painting);
    }
    public function deletePainting(\App\Painting $painting){
        $painting->delete();
        return redirect('/home');
    }
}
