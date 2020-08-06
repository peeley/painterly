<?php

namespace App;

use App\Painting;
use App\Events\PaintingUpdateEvent as Event;

class UpdateProtocol
{

    public static function update(Painting $painting, array $update)
    {
        $action = $update['action'] ?? null;
        if ($action === 'clear') {
            $painting->strokes = [];
        } else if ($action === 'undo') {
            $painting->strokes = array_slice($painting->strokes, 0, -1);
        } else if ($action === 'add') {
            $new_stroke = json_decode($update['strokes']);
            $painting->strokes = array_merge($painting->strokes, [$new_stroke]);
        }

        if (isset($update['title'])) {
            $painting->title = $update['title'];
        }
        $painting->save();

        // TODO error handling, broadcast to other users viewing painting
        event(new Event($update, $painting));
    }
}
