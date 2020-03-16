<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
    
    public function get(\App\Painting $painting){
        return $painting;
    }


}
