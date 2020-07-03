import { PenStroke } from './PenTool';
import { RectStroke } from './RectTool';
import Stroke from './Stroke';

export class VersionController {
    private versionHistory: Array<Stroke> = [];
    private currentVersion: number = 0
    push(item: Stroke){
        if(this.currentVersion !== this.versionHistory.length){
            this.versionHistory = this.versionHistory.slice(
                                    0, this.currentVersion);
        }
        this.versionHistory.push(item);
        this.currentVersion += 1;
    }
    undo = (drawSurface: React.RefObject<HTMLCanvasElement>) => {
        if(this.currentVersion > 0){
            this.currentVersion -= 1;
            this.redrawCanvas(drawSurface);
        }
    }
    redo = (drawSurface: React.RefObject<HTMLCanvasElement>) => {
        if(this.currentVersion < this.versionHistory.length){
            this.currentVersion += 1;
            this.redrawCanvas(drawSurface);
        }
    }
    wipeHistory = () => {
        this.versionHistory = [];
        this.currentVersion = 0;
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
            this.push(stroke);
        }
    }
}
