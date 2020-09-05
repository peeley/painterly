import axios from 'axios';
import { fabric } from 'fabric';
import Echo from 'laravel-echo';

export class VersionController {
    private paintingId: number;
    private versionHistory: Array<fabric.Object> = [];
    private drawSurface: fabric.Canvas;
    private currentVersion: number = 0;

    constructor(id: number, drawSurface: fabric.Canvas) {
        this.paintingId = id;
        this.drawSurface = drawSurface;
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
                        if (!data.strokes) {
                            console.log('Received bad `add` event');
                            return;
                        }
                        this.pushItemToHistory(this.deserializeItem(data.strokes));
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
    pushItemToHistory = (item: fabric.Object) => {
        if (this.currentVersion !== this.versionHistory.length) {
            this.versionHistory = this.versionHistory.slice(
                0, this.currentVersion);
        }
    }
    push = (item: fabric.Object) => {
        this.sendEvent({
            strokes: JSON.stringify(item),
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
    serializeHistory = () => {
        // let history = this.versionHistory.map( stroke => { return stroke.serialize(); });
        // return history;
    }
    // TODO create type for serialized strokes
    deserializeHistory = (history: Array<any>) => {
        history.map(json => {
            let stroke = this.deserializeItem(json);
            this.versionHistory.push(stroke);
            this.currentVersion += 1;
            return stroke;
        });
    }
    deserializeItem = (json: any): fabric.Object => {
        let stroke = new fabric.Object();
        switch (json.type) {
            case 'fill':
                // stroke = new FillStroke(json.color, json.backgroundColor);
                break;
            default:
                console.log('unable to deserialize stroke');
                stroke = new fabric.Object();
                return stroke;
        }
        // stroke.deserialize(json);
        return stroke;
    }
}

interface PaintingUpdateEvent {
    paintingId: number,
    action: "add" | "clear" | "undo" | "redo" | null,
    strokes: fabric.Object | null
    title: string | null
}
