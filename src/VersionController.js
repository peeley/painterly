import { PenTool } from './PenTool.js';
import { RectTool } from './RectTool.js';

export class VersionController {
    constructor(){
        this.versionHistory = [];
        this.currentVersion = 0
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
        this.redrawCanvas = this.redrawCanvas.bind(this);
    }
    push(item){
        this.versionHistory.push(item);
        this.currentVersion += 1;
    }
    undo(drawSurface){
        console.log('undo!');
        console.log(this.currentVersion, this.versionHistory.length);
        if(this.currentVersion > 0){
            this.currentVersion = this.currentVersion - 1;
        }
        this.redrawCanvas(drawSurface);
    }
    redo(drawSurface){
        console.log('redo!');
        if(this.currentVersion < this.versionHistory.length - 1){
            this.currentVersion = this.currentVersion + 1;
        }
        this.redrawCanvas(drawSurface);
    }
    redrawCanvas(drawSurface){
        let context = drawSurface.current.getContext('2d')
        this.clearCanvas(context);
        let versionCounter = 0;
        console.log(this.currentVersion, this.versionHistory.length);
        while(versionCounter < this.currentVersion){
            console.log('iterating');
            let stroke = this.versionHistory[versionCounter];
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
            versionCounter++;
        }
        // TODO: redraw canvas after undo/redo based on versionHistory state
    }
    clearCanvas(context){
        const width = context.canvas.width;
        const height = context.canvas.height;
        context.clearRect(0, 0, width, height);
    }
}
