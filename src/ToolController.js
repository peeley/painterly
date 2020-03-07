import { PenTool } from './PenTool.js';
import { RectTool } from './RectTool.js';

export class ToolController{
    constructor(surfaceRef){
        this.toolSet = {
            'pen': new PenTool(surfaceRef),
            'rect': new RectTool(surfaceRef)
        }
        this.selectedTool = this.toolSet['pen'];
        this.selectNewTool = this.selectNewTool.bind(this);
    }
    handleEvent(event, context){
        this.selectedTool.handleEvent(event, context);
    }
    selectNewTool(toolName){
        this.selectedTool = this.toolSet[toolName];
    }
    setStrokeWidth(width){
        this.selectedTool.setStrokeWidth(width);
    }
    setColor(color){
        this.selectedTool.setColor(color);
    }
}
