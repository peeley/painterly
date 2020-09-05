import { Tool } from './Tool';
import { fabric } from 'fabric';

export class PenTool extends Tool {
    private readonly joinType: CanvasLineJoin = 'round';
    private readonly lineCap: CanvasLineCap = 'round';
    constructor(){
        super('pen');
        this.toolName = 'pen';
        this.displayName = 'Pen';
        this.strokeWidth = 3;
    }
    select = (canvas: fabric.Canvas) => {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = this.strokeWidth;
        canvas.freeDrawingBrush.color = this.color;
        console.log('pen tool selected!');
        console.log(canvas);
    }
    deselect = (canvas: fabric.Canvas) => {
        canvas.isDrawingMode = false;
    }
    handleEvent(type: string, event: any, context: fabric.Canvas): fabric.Path | void {}
}
