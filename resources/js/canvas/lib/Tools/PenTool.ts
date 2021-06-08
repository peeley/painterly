import { fabric } from 'fabric';
import { MouseInputType } from "./MouseInputType";
import { Tool } from './Tool';

// Uses fabric's builting drawing mode:
// http://fabricjs.com/fabric-intro-part-4#free_drawing
export class PenTool extends Tool {
    constructor() {
        super();
        this.displayName = 'Pen';
        this.displayIcon = 'fas fa-pen-fancy';
    }
    select = (canvas: fabric.Canvas) => {
        canvas.isDrawingMode = true;
    }
    deselect = (canvas: fabric.Canvas) => {
        canvas.isDrawingMode = false;
    }
    handleEvent(
        _type: MouseInputType,
        _event: any,
        canvas: fabric.Canvas
    ): fabric.Path | void {
        canvas.freeDrawingBrush.width = this.strokeWidth;
        canvas.freeDrawingBrush.color = this.color;
    }
}
