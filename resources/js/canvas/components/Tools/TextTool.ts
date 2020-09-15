import { Tool, MouseEventType } from './Tool';
import { fabric } from 'fabric';

export class TextTool extends Tool {
    private stroke: fabric.IText;
    constructor() {
        super('text');
        this.toolName = 'text';
        this.displayName = 'Text';
        this.stroke = new fabric.IText('');
    }
    select = (_canvas: fabric.Canvas) => { }
    deselect = (_canvas: fabric.Canvas) => { }
    handleEvent(type: MouseEventType, event: any, context: fabric.Canvas) {
        const pointer = context.getPointer(event.e);
        let xCoord = pointer.x;
        let yCoord = pointer.y;
        if (type === 'mouse:down' && !context.getActiveObject()) {
            this.stroke = new fabric.IText('text', { left: xCoord, top: yCoord });
            context.add(this.stroke);
            context.setActiveObject(this.stroke);
        }
        if (type === 'mouse:up') {
            context.fire('push:added', { target: this.stroke });
            this.stroke = new fabric.IText('');
        }
    }
}
