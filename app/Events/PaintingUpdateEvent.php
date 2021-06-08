<?php

namespace App\Events;

use App\Models\Painting;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaintingUpdateBroadcast implements ShouldBroadcast
{

    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $paintingId;
    public $action;
    public $objects;
    public $title;

    public function __construct(array $update, Painting $painting)
    {
        $this->paintingId = $painting->id;
        $this->action = $update['action'] ?? null;
        $this->objects = isset($update['objects']) ? json_decode($update['objects']) : null;
        $this->title = $update['title'] ?? null;
    }

    public function broadcastOn()
    {
        return ['painting.' . $this->paintingId];
    }
}
