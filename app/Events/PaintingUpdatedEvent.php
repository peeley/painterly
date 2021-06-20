<?php

namespace App\Events;

use App\Models\Painting;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaintingUpdatedEvent implements ShouldBroadcast
{

    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $paintingId;
    public $action;
    public $objects;
    public $title;

    public function __construct(Painting $painting, array $update)
    {
        $this->paintingId = $painting->id;
        $this->action = $update['action'];
        $this->objects = isset($update['objects']) ? json_decode($update['objects']) : null;
    }

    public function broadcastOn()
    {
        return new Channel('painting.' . $this->paintingId);
    }

    public function broadcastAs()
    {
        return 'painting.updated';
    }
}
