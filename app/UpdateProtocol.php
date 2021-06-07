<?php

namespace App;

use App\Painting;
use App\Events\PaintingUpdateBroadcast as Broadcast;
use Illuminate\Support\Arr;

class UpdateProtocol
{

    public static function update(Painting $painting, array $update)
    {
        $action = $update['action'] ?? null;
        if ($action === 'clear') {
            $painting->objects = [];
        } else if ($action === 'add') {
            $new_strokes = json_decode($update['objects']);
            $objects = array_merge($painting->objects, $new_strokes);
            $painting->objects = $objects;
        } else if ($action === 'modify') {
            $modified_objects = json_decode($update['objects'], true);
            $saved_objects = $painting->objects;
            // TODO reduce n^2 complexity, will NOT scale well with big modifications
            // perhaps make objects field of painting a hash table?
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
            $remaining = array_values(Arr::where($objects,
                function($value, $key) use ($removed_uuids) {
                    $object_uuid = $value['uuid'];
                    return !in_array($object_uuid, $removed_uuids);
                }));
            $painting->objects = $remaining;
        }

        if (isset($update['title'])) {
            $painting->title = $update['title'];
        }
        $painting->save();

        // TODO error handling
        broadcast(new Broadcast($update, $painting))->toOthers();
    }
}
