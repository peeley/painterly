import { PenStroke } from './PenTool';
import { RectStroke } from './RectTool';
import Stroke from './Stroke';
import axios from 'axios';

export class VersionController {
    private paintingId: number;
    private versionHistory: Array<Stroke> = [];
    private currentVersion: number = 0;

    constructor(id: number){
        this.paintingId = id;
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
        // TODO call PUT endpoint with undo action
        if(this.currentVersion > 0){
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
        console.log(history);
        for(const json of history){
            let stroke: Stroke;
            switch(json.type){
                case 'pen':
                    stroke = new PenStroke(json.strokeWidth, json.color);
                    break;
                case 'rect':
                    stroke = new RectStroke(json.color);
                    break;
                default:
                    continue;
            }
            stroke.deserialize(json);
            this.versionHistory.push(stroke);
            this.currentVersion += 1;
        }
    }
}
