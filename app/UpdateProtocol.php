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
            $painting->objects = [];
        } else if ($action === 'undo') {
            $painting->objects = array_slice($painting->objects, 0, -1);
        } else if ($action === 'add') {
            $new_stroke = json_decode($update['objects']);
            $painting->objects = array_merge($painting->objects, [$new_stroke]);
        }

        if (isset($update['title'])) {
            $painting->title = $update['title'];
        }
        $painting->save();

        // TODO error handling
        broadcast(new Event($update, $painting))->toOthers();
    }
}
