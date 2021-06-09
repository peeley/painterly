import axios from 'axios';
import { fabric } from 'fabric';
import Echo from 'laravel-echo';
import { UUIDObject, Transformation, OutgoingEvent, UpdateAction } from './RevisionTracker';

interface PaintingUpdateBroadcast {
    paintingId: number,
    action: UpdateAction | null,
    objects: [UUIDObject] | null
    title: string | null
}

export class IncomingBroadcastHandler {
    private paintingId: number;
    private canvas: fabric.Canvas;
    private setSyncing: (_: boolean) => void;
    constructor(
        id: number,
        canvas: fabric.Canvas,
        setSyncing: (_: boolean) => void
    ) {
        this.paintingId = id;
        this.canvas = canvas;
        this.setSyncing = setSyncing;
    }
    mountChannelListener = () => {
        let echo = new Echo({
            broadcaster: 'pusher',
            key: process.env.MIX_PUSHER_APP_KEY,
            wsHost: window.location.hostname,
            wsPort: 6001,
            forceTLS: false,
            disableStats: false
        });
        echo.channel(`painting.${this.paintingId}`)
            .listen('PaintingUpdated', (data: PaintingUpdateBroadcast) => {
                console.log(data);
                switch (data.action) {
                    case 'add':
                        if (!data.objects) {
                            throw Error('Missing object on `add` event.');
                        }
                        this.handleIncomingAddEvent(data.objects);
                        break;
                    case 'modify':
                        if (!data.objects) {
                            throw Error('Missing object on `modify` event.');
                        }
                        this.handleIncomingModifyEvent(data.objects);
                        break;
                    case 'clear':
                        this.canvas.clear();
                        break;
                    case 'remove':
                        if (!data.objects) {
                            throw Error('Missing object on `remove` event.');
                        }
                        this.handleIncomingRemoveEvent(data.objects);
                        break;
                    default:
                        throw Error(`Unsupported update type: ${data.action}`);
                }
            });
    }
    handleIncomingAddEvent = (objects: UUIDObject[]) => {
        if (!objects) {
            console.log('Received bad `add` event');
            return;
        }
        console.log('received add event: ', objects);
        fabric.util.enlivenObjects(objects, (objects: Array<UUIDObject>) => {
            objects.forEach((obj: UUIDObject) => {
                console.log('enlivened: ', obj);
                this.canvas.add(obj);
            });
        }, 'fabric');
    }
    handleIncomingModifyEvent = (objects: UUIDObject[]) => {
        // need to signal to canvas that we're currently handling an incoming
        // modify, so that the canvas can temporarily turn off listening for
        // modify events. otherwise, we're stuck in an infinite loop of causing
        // events by handling events. see ../components/Canvas.tsx
        this.canvas.off('object:modified');
        this.canvas.discardActiveObject();

        if (this.canvas.getActiveObject() instanceof fabric.ActiveSelection) {
            // prevent modifying selected object
            this.canvas.discardActiveObject();
        }

        // TODO reduce n^2 complexity
        for (let modified of objects) {
            this.canvas.forEachObject((obj: any) => {
                // TODO convert obj to type UUIDObject
                if (obj.uuid === modified.uuid) {
                    obj.set(modified);
                    obj.setCoords();
                    return;
                }
            });
        }

        this.canvas.renderAll();
        // second param of `on` should be IEvent, not necessary since we're just
        // signalling we're done handling an incoming event
        this.canvas.on('finished:modified', {} as any);
    }
    handleIncomingRemoveEvent = (objects: [UUIDObject]) => {
        for (let object of objects) {
            this.canvas.forEachObject((obj: any) => {
                if (obj.uuid === object.uuid) {
                    this.canvas.remove(obj);
                    return;
                }
            });
        }
    }
    checksumMatches = (checksum: string): boolean => {
        let currentCanvasChecksum = btoa(this.canvas.getObjects().toString());
        return currentCanvasChecksum === checksum;
    }
}
