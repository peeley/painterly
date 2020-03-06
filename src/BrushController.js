import { Brush } from './Brush.js';

export class BrushController{
    constructor(surfaceRef){
        this.selectedBrush = new Brush(surfaceRef);
    }
    handleEvent(event, context){
        this.selectedBrush.handleEvent(event, context);
    }
    setStrokeWidth(width){
        this.selectedBrush.setStrokeWidth(width);
    }
    setColor(color){
        this.selectedBrush.setColor(color);
    }
}
