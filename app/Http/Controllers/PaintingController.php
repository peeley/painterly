<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaintingUpdateRequest;
use Illuminate\Support\Facades\Auth;
use \App\Painting;
use Illuminate\Support\Facades\Gate;

class PaintingController extends Controller
{
    public function createPainting()
    {
        $user = Auth::user();
        $painting = $user->paintings()->create();
        return response()->json($painting);
    }

    public function show(Painting $painting)
    {
        Gate::authorize('view-painting', $painting);
        return view('app', ['title' => $painting->title, 'id' => $painting->id]);
    }
    public function getPainting(Painting $painting)
    {
        return $painting;
    }
    public function putPainting(PaintingUpdateRequest $request, Painting $painting)
    {
        $request->authorize();
        $validated = $request->validate();

        $painting->strokes = isset($validated['strokes']) ?
            json_decode($validated['strokes']) : $painting->strokes;
        $painting->title = $validated['title'] ?? $painting->title;
        $painting->save();
        return response()->json($painting);
    }
    public function deletePainting(Painting $painting)
    {
        $painting->delete();
        return response('OK', 200);
    }
}
