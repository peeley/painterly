import { ToolController } from './ToolController.js';

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
        console.log(drawSurface);
        console.log('undo!');
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
        //context.clear();
        let versionCounter = 0;
        while(versionCounter < this.currentVersion){
            let stroke = this.versionHistory[versionCounter];
            ToolController.redoStroke(stroke, context);
            versionCounter++;
        }
        // TODO: redraw canvas after undo/redo based on versionHistory state
    }
}
