import { PenTool } from './PenTool.js';

export class ToolController{
    constructor(surfaceRef){
        this.selectedTool = new PenTool(surfaceRef);
    }
    handleEvent(event, context){
        this.selectedTool.handleEvent(event, context);
    }
    setStrokeWidth(width){
        this.selectedTool.setStrokeWidth(width);
    }
    setColor(color){
        this.selectedTool.setColor(color);
    }
}
