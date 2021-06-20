import { fabric } from 'fabric';
import { UUIDObject, UpdateAction } from './RevisionTracker';

interface PaintingUpdateBroadcast {
    paintingId: number,
    action: UpdateAction | null,
    objects: [UUIDObject] | null
    title: string | null
}

export class IncomingBroadcastHandler {
    private paintingId: number;
    private canvas: fabric.Canvas;
    constructor(
        id: number,
        canvas: fabric.Canvas
    ) {
        this.paintingId = id;
        this.canvas = canvas;
    }
    mountChannelListener = () => {
        console.log(`even channel: painting.${this.paintingId}`);
        // window.Echo property is set in resources/js/bootstrap.js
        (window as any).Echo.channel(`painting.${this.paintingId}`)
            .listen('.painting.updated', (data: PaintingUpdateBroadcast) => {
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
            this.canvas.renderAll();
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

        // FIXME reduce n^2 complexity
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
    };
    setCanvas(canvas: fabric.Canvas): void {
        this.canvas = canvas;
    }
}
