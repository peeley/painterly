<?php

namespace App;

use App\Painting;
use App\Events\PaintingUpdateEvent as Event;
use Illuminate\Support\Arr;

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
            $objects = $painting->objects;
            array_push($objects, $new_stroke);
            $painting->objects = $objects;
        } else if ($action === 'modify') {
            $modified_object = json_decode($update['objects'], true);
            $objects = $painting->objects;
            foreach ($objects as &$object) {
                if ($object['uuid'] == $modified_object['uuid']) {
                    $object = array_merge($object, $modified_object);
                    break;
                }
            }
            $painting->objects = $objects;
        } else if ($action === 'remove') {
            $objects = $painting->objects;
            $removed_uuid = json_decode($update['objects'])->uuid;
            $remaining = array_values(
                Arr::where($objects, function ($value, $key) use ($removed_uuid) {
                    return $value['uuid'] !== $removed_uuid;
                })
            );
            $painting->objects = $remaining;
        }

        if (isset($update['title'])) {
            $painting->title = $update['title'];
        }
        $painting->save();

        // TODO error handling
        broadcast(new Event($update, $painting))->toOthers();
    }
}
