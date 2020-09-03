import { Tool } from './Tool';
import { fabric } from 'fabric';

export class PenTool extends Tool {
    private readonly joinType: CanvasLineJoin = 'round';
    private readonly lineCap: CanvasLineCap = 'round';
    constructor(){
        super('pen');
        this.displayName = 'Pen';
        this.strokeWidth = 3;
    }
    // TODO define event type
    handleEvent(type: string, event: any, context: fabric.Canvas): fabric.Path | void {
        context.isDrawingMode = true;
        context.freeDrawingBrush.width = this.strokeWidth;
        context.freeDrawingBrush.color = this.color;
    }
}
