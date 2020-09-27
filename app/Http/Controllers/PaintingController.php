<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaintingUpdateRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Painting;
use App\UpdateProtocol;

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
        $this->authorize('view', $painting);
        return $painting;
    }
    public function putPainting(PaintingUpdateRequest $request, Painting $painting)
    {
        $this->authorize('update', $painting);
        $validated = $request->validated();

        UpdateProtocol::update($painting, $validated);
        $painting->save();
        return response('Painting successfully updated.', 200);
    }
    public function deletePainting(Painting $painting)
    {
        $painting->delete();
        return response('OK', 200);
    }
    public function postPreview(Request $request, Painting $painting) {
        $validated = $request->validate([
            'data' => ['required', 'string'],
        ]);

        $painting->preview = $validated['data'];
        $painting->save();
        return response('OK', 200);
    }
}
