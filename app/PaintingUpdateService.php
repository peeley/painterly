<?php

namespace App;

use App\Models\Painting;
use App\Events\PaintingUpdated;
use Illuminate\Support\Arr;

class PaintingUpdateService
{
    public function __construct()
    {
    }

    public function updatePainting(Painting $painting, array $updateJson)
    {
        $action = $updateJson['action'] ?? null;
        switch ($action) {
            case 'clear':
                $this->clearPainting($painting);
                break;
            case 'add':
                $this->addStrokesToPainting($painting, $updateJson);
                break;
            case 'modify':
                $this->modifyPaintingObjects($painting, $updateJson);
                break;
            case 'remove':
                $this->removeObjectsFromPainting($painting, $updateJson);
                break;
        }

        if (isset($updateJson['title'])) {
            $painting->title = $updateJson['title'];
        }

        $painting->save();

        // TODO error handling
        broadcast(new PaintingUpdated($updateJson, $painting))->toOthers();
    }

    private function clearPainting(Painting $painting)
    {
        $painting->objects = [];
    }

    private function addStrokesToPainting(Painting $painting, array $update)
    {
        $new_strokes = json_decode($update['objects']);
        $objects = array_merge($painting->objects, $new_strokes);
        $painting->objects = $objects;
    }

    private function modifyPaintingObjects(Painting $painting, array $update)
    {
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
    }

    private function removeObjectsFromPainting(Painting $painting, array $update)
    {
        $objects = $painting->objects;
        $removed_uuids = array_map(function ($object) {
            return $object->uuid;
        }, json_decode($update['objects']));
        $remaining = array_values(Arr::where(
            $objects,
            function ($value, $key) use ($removed_uuids) {
                $object_uuid = $value['uuid'];
                return !in_array($object_uuid, $removed_uuids);
            }
        ));
        $painting->objects = $remaining;
    }
}
