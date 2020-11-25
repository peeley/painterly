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
            $modified_objects = json_decode($update['objects'], true);
            $saved_objects = $painting->objects;
            foreach ($modified_objects as $modified) {
                foreach ($saved_objects as &$saved) {
                    if ($saved['uuid'] == $modified['uuid']) {
                        $saved = array_merge($saved, $modified);
                        break;
                    }
                }
            }
            $painting->objects = $saved_objects;
        } else if ($action === 'remove') {
            $objects = $painting->objects;
            $removed_uuids = array_map( function($object){
                return $object->uuid;
            }, json_decode($update['objects']));
            $remaining = Arr::whereNot($objects,
                function($value, $key) use ($removed_uuids) {
                    $object_uuid = $value->uuid;
                    return in_array($object_uuid, $removed_uuids);
                })
                ->get();
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
