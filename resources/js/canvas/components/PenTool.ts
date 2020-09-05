import { Tool } from './Tool';
import { fabric } from 'fabric';

export class PenTool extends Tool {
    constructor(){
        super('pen');
        this.toolName = 'pen';
        this.displayName = 'Pen';
        this.strokeWidth = 3;
    }
    select = (canvas: fabric.Canvas) => {
        canvas.isDrawingMode = true;
    }
    deselect = (canvas: fabric.Canvas) => {
        canvas.isDrawingMode = false;
    }
    handleEvent(_: string, __: any, context: fabric.Canvas): fabric.Path | void {
        context.freeDrawingBrush.width = this.strokeWidth;
        context.freeDrawingBrush.color = this.color;
    }
}
