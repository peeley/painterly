import { PenStroke } from './PenTool';
import { RectStroke } from './RectTool';
import Stroke from './Stroke';
import axios from 'axios';
import Echo from 'laravel-echo';

export class VersionController {
    private paintingId: number;
    private versionHistory: Array<Stroke> = [];
    private currentVersion: number = 0;

    constructor(id: number){
        this.paintingId = id;
        //Pusher.logToConsole = `${process.env.APP_DEBUG}` === 'true';
        let echo = new Echo({
            broadcaster: 'pusher',
            key: `${process.env.MIX_PUSHER_APP_KEY}`,
            cluster: `${process.env.MIX_PUSHER_APP_CLUSTER}`,
            forceTLS: true
        });
        echo.channel(`painting.${this.paintingId}`)
        .listen('painting-update', (data: PaintingUpdateEvent) => {
            switch(data.action){
                case 'add':
                    if(!data.strokes){
                        console.log('Received bad `add` event');
                        return;
                    }
                    this.push(this.deserializeItem(data.strokes));
                    break;
            }
        })
    }

    push(item: Stroke){
        if(this.currentVersion !== this.versionHistory.length){
            this.versionHistory = this.versionHistory.slice(
                                    0, this.currentVersion);
        }
        if(!item.getIndicator()){
            axios.put(`${process.env.MIX_APP_URL}/api/p/${this.paintingId}`,
                      { strokes: JSON.stringify(item.serialize()),
                        action: 'add' },
                      { headers: { 'Content-Type': 'application/json' } })
                .then(response => {
                    if (response.status === 401) { // not logged in
                        window.location.replace(`${process.env.MIX_APP_URL}/login`);
                    }
                    else if (response.status === 403) { // not authorized
                        alert('You do not have permissions to edit this item.');
                    }
                });
        }
        this.versionHistory.push(item);
        this.currentVersion += 1;
    }
    undo = (drawSurface: React.RefObject<HTMLCanvasElement>) => {
        if(this.currentVersion > 0){
            axios.put(`${process.env.MIX_APP_URL}/api/p/${this.paintingId}`,
                        { action: 'undo' },
                        { headers: { 'Content-Type': 'application/json' } })
                .then(response => {
                    if (response.status === 401) { // not logged in
                        window.location.replace(`${process.env.MIX_APP_URL}/login`);
                    }
                    else if (response.status === 403) { // not authorized
                        alert('You do not have permissions to edit this item.');
                    }
                });
            this.currentVersion -= 1;
            this.redrawCanvas(drawSurface);
        }
    }
    redo = (drawSurface: React.RefObject<HTMLCanvasElement>) => {
        // TODO call PUT endpoint, figure out how to implement redo
        if(this.currentVersion < this.versionHistory.length){
            this.currentVersion += 1;
            this.redrawCanvas(drawSurface);
        }
    }
    wipeHistory = () => {
        axios.put(`${process.env.MIX_APP_URL}/api/p/${this.paintingId}`,
                  { action: 'clear' },
                  { headers: { 'Content-Type': 'application/json' } })
            .then(response => {
                if (response.status === 200) {
                    this.versionHistory = [];
                    this.currentVersion = 0;
                }
                else if (response.status === 401) { // not logged in
                    window.location.replace(`${process.env.MIX_APP_URL}/login`);
                }
                else if (response.status === 403) { // not authorized
                    alert('You do not have permissions to edit this item.');
                }
            });
    }
    redrawCanvas = (drawSurface: React.RefObject<HTMLCanvasElement>) => {
        if(!drawSurface.current){
            return;
        }
        let context = drawSurface.current.getContext('2d');
        if(!context){
            return;
        }
        let versionCounter = 1;
        const width = context.canvas.width;
        const height = context.canvas.height;
        context.clearRect(0, 0, width, height);
        while(versionCounter <= this.currentVersion){
            const stroke = this.versionHistory[versionCounter-1];
            stroke.redoStroke(context);
            if(stroke.getIndicator()){
                this.versionHistory.splice(versionCounter-1, 1);
                this.currentVersion -= 1;
            }
            else{
                versionCounter += 1;
            }
        }
    }
    serializeHistory = () => {
        let history = this.versionHistory.map( stroke => { return stroke.serialize(); });
        return history;
    }
    // TODO create type for serialized strokes
    deserializeHistory = (history: Array<any>) => {
        history.map( json => {
            let stroke = this.deserializeItem(json);
            this.versionHistory.push(stroke);
            this.currentVersion += 1;
            return stroke;
        });
    }
    deserializeItem = (json: any): Stroke => {
        let stroke: Stroke;
        switch(json.type){
            case 'pen':
                stroke = new PenStroke(json.strokeWidth, json.color);
                break;
            case 'rect':
                stroke = new RectStroke(json.color);
                break;
            default:
                console.log('unable to deserialize stroke');
                stroke = new Stroke('n/a', 'n/a');
                return stroke;
        }
        stroke.deserialize(json);
        return stroke;
    }
}

interface PaintingUpdateEvent {
    paintingId: number,
    action: "add" | "clear" | "undo" | "redo" | null,
    strokes: Stroke | null
    title: string | null
}
