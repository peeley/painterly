import { PenTool } from './PenTool.js';
import { RectTool } from './RectTool.js';

export class VersionController {
    constructor(){
        this.versionHistory = [];
        this.currentVersion = 0;
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
        this.redrawCanvas = this.redrawCanvas.bind(this);
    }
    push(item){
        if(this.currentVersion !== this.versionHistory.length){
            this.versionHistory = this.versionHistory.slice(
                                    0, this.currentVersion);
        }
        this.versionHistory.push(item);
        this.currentVersion += 1;
    }
    undo(drawSurface){
        if(this.currentVersion > 0){
            this.currentVersion -= 1;
            this.redrawCanvas(drawSurface);
        }
    }
    redo(drawSurface){
        if(this.currentVersion < this.versionHistory.length){
            this.currentVersion += 1;
            this.redrawCanvas(drawSurface);
        }
    }
    redrawCanvas(drawSurface){
        let context = drawSurface.current.getContext('2d')
        this.clearCanvas(context);
        let versionCounter = 1;
        while(versionCounter <= this.currentVersion){
            let stroke = this.versionHistory[versionCounter-1];
            switch(stroke.type){
                case 'pen':
                    PenTool.redoStroke(stroke, context);
                    break;
                case 'rect':
                    RectTool.redoStroke(stroke, context);
                    break
                default:
                    console.log('unknown stroke type');
            }
            versionCounter += 1;
        }
    }
    clearCanvas(context){
        const width = context.canvas.width;
        const height = context.canvas.height;
        context.clearRect(0, 0, width, height);
    }
}
