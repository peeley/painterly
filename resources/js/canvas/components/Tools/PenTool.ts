import { Tool, MouseEventType } from './Tool';
import { fabric } from 'fabric';

export class PenTool extends Tool {
    constructor() {
        super();
        this.displayName = 'Pen';
        this.strokeWidth = 3;
        this.displayIcon = 'fas fa-pen-fancy';
    }
    select = (canvas: fabric.Canvas) => {
        canvas.isDrawingMode = true;
    }
    deselect = (canvas: fabric.Canvas) => {
        canvas.isDrawingMode = false;
    }
    handleEvent(_type: MouseEventType, _event: any, context: fabric.Canvas): fabric.Path | void {
        context.freeDrawingBrush.width = this.strokeWidth;
        context.freeDrawingBrush.color = this.color;
    }
}
