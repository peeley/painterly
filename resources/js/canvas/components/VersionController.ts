import { PenStroke } from './PenTool';
import { RectStroke } from './RectTool';
import { FillStroke } from './FillTool';
import Stroke from './Stroke';
import axios from 'axios';
import Echo from 'laravel-echo';

export class VersionController {
    private paintingId: number;
    private versionHistory: Array<Stroke> = [];
    private drawSurface: React.RefObject<HTMLCanvasElement>;
    private currentVersion: number = 0;

    constructor(id: number, drawSurface: React.RefObject<HTMLCanvasElement>){
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
            switch(data.action){
                case 'add':
                    if(!data.strokes){
                        console.log('Received bad `add` event');
                        return;
                    }
                    this.pushItemToHistory(this.deserializeItem(data.strokes));
                    break;
                case 'undo':
                    this.currentVersion -= 1;
                    break;
                case 'clear':
                    this.versionHistory = [];
                    this.currentVersion = 0;
                    break;
            }
            this.redrawCanvas();
        });
    }
    pushItemToHistory = (item: Stroke) => {
        if(!item.getIndicator()){
            if(this.currentVersion !== this.versionHistory.length){
                this.versionHistory = this.versionHistory.slice(
                    0, this.currentVersion);
            }
        }
        this.versionHistory.push(item);
        this.currentVersion += 1;
    }
    push = (item: Stroke) => {
        if(!item.getIndicator()){
            this.sendEvent({ strokes: JSON.stringify(item.serialize()),
                             action: 'add' }, () => {
                                 // TODO undo on bad response?
                             });
            this.pushItemToHistory(item);
            this.redrawCanvas();
        }
        else{
            this.versionHistory.push(item);
            this.currentVersion += 1;
        }
    }
    undo = () => {
        if(this.currentVersion > 0){
            this.sendEvent({action: 'undo'}, () => {
                this.currentVersion -= 1;
                this.redrawCanvas();
            });
        }
    }
    redo = () => {
        // TODO call PUT endpoint, figure out how to implement redo
        if(this.currentVersion < this.versionHistory.length){
            this.currentVersion += 1;
            this.redrawCanvas();
        }
    }
    wipeHistory = () => {
        this.sendEvent({ action: 'clear'}, () => {
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
    redrawCanvas = () => {
        if(!this.drawSurface.current){
            return;
        }
        let context = this.drawSurface.current.getContext('2d');
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
            case 'fill':
                stroke = new FillStroke(json.color, json.backgroundColor);
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
