<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaintingUpdateRequest;
use Illuminate\Support\Facades\Auth;
use \App\Painting;

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
        $this->authorize('view', $painting);
        return view('app', ['title' => $painting->title, 'id' => $painting->id]);
    }
    public function getPainting(Painting $painting)
    {
        return $painting;
    }
    public function putPainting(PaintingUpdateRequest $request, Painting $painting)
    {
        $this->authorize('update', $painting);
        $validated = $request->validated();

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
