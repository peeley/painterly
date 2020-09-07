import axios from 'axios';
import { fabric } from 'fabric';
import { v4 } from 'uuid'
import Echo from 'laravel-echo';

export class VersionController {
    private paintingId: number;
    private versionHistory: Array<fabric.Object> = [];
    private drawSurface: fabric.Canvas;
    private currentVersion: number = 0;

    constructor(id: number, drawSurface: fabric.Canvas) {
        this.paintingId = id;
        this.drawSurface = drawSurface;
    }
    mountChannelListener = () => {
        let echo = new Echo({
            broadcaster: 'pusher',
            key: process.env.MIX_PUSHER_APP_KEY,
            cluster: process.env.MIX_PUSHER_APP_CLUSTER,
            forceTLS: true
        });
        echo.channel(`painting.${this.paintingId}`)
            .listen('PaintingUpdateEvent', (data: PaintingUpdateEvent) => {
                switch (data.action) {
                    case 'add':
                        console.log(`received 'add' event from other instance`, data);
                        if (!data.objects) {
                            console.log('Received bad `add` event');
                            return;
                        }
                        this.drawSurface.off('object:added', this.push);
                        fabric.util.enlivenObjects([data.objects], (objects) => {
                            objects.forEach((obj) => {
                                this.drawSurface.add(obj);
                            });
                            console.log(`added to canvas: `, this.drawSurface.getObjects());
                            this.drawSurface.on('object:added', this.push);
                        }, 'fabric');
                        this.pushItemToHistory(data.objects);
                        break;
                    case 'undo':
                        this.currentVersion -= 1;
                        break;
                    case 'clear':
                        this.drawSurface.clear();
                        break;
                }
            });
    }
    pushItemToHistory = (_item: fabric.Object) => {
        if (this.currentVersion !== this.versionHistory.length) {
            this.versionHistory = this.versionHistory.slice(
                0, this.currentVersion);
        }
    }
    push = (event: any /* fabric.Object */ ) => {
        let item = event.target;
        if(!item){
            return;
        }
        item.selectable = false;
        item.uuid = v4();
        this.sendEvent({
            objects: JSON.stringify(item.toJSON(['uuid'])),
            action: 'add'
        }, () => {
            // TODO undo on bad response?
        });
        this.pushItemToHistory(item);
    }
    undo = () => {
        if (this.currentVersion > 0) {
            this.sendEvent({ action: 'undo' }, () => {
                this.currentVersion -= 1;
            });
        }
    }
    redo = () => {
        // TODO call PUT endpoint, figure out how to implement redo
        if (this.currentVersion < this.versionHistory.length) {
            this.currentVersion += 1;
        }
    }
    wipeHistory = () => {
        this.sendEvent({ action: 'clear' }, () => {
            // TODO handle bad response?
        });
        this.versionHistory = [];
        this.currentVersion = 0;
    }
    // TODO define outgoing event type
    sendEvent = (event: any, callback: Function) => {
        axios.put(`${process.env.MIX_APP_URL}/api/p/${this.paintingId}`,
            event,
            { headers: { 'Content-Type': 'application/json' } })
            .then(response => {
                if (response.status === 200) {
                    callback();
                }
                else if (response.status === 401) { // not logged in
                    window.location.replace(`${process.env.MIX_APP_URL}/login`);
                }
                else if (response.status === 403) { // not authorized
                    alert('You do not have permissions to edit this item.');
                }
            });
    }
    // TODO create type for serialized objects
    deserializeHistory = (history: Array<any>) => {
        console.log(`deserializing from backend: `, history);
        this.drawSurface.loadFromJSON({ objects: history}, () => {
            this.drawSurface.forEachObject( obj => {
                obj.selectable = false;
            })
            this.drawSurface.renderAll();
        });
    }
    setDrawSurface(canvas: fabric.Canvas): void {
        this.drawSurface = canvas;
    }
}

interface PaintingUpdateEvent {
    paintingId: number,
    action: "modify" | "add" | "remove" | "clear" | "undo" | "redo" | null,
    objects: fabric.Object | null
    title: string | null
}
