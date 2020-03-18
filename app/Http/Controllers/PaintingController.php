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
        $painting = $user->paintings()->create([
            'title' => 'Blank painting',
            'strokes' => '{}'
        ]);
        return redirect("/painting/{$painting->id}");
    }
    
    public function show(\App\Painting $painting){
        return view('app');
    }
    public function getStrokes(\App\Painting $painting){
        return $painting->strokes;
    }
    public function editStrokes(Request $request, \App\Painting $painting){
        //Gate::authorize('edit-painting', $painting);
        return response()->json([
            'here' => $request->all()
        ]);
    }
}
