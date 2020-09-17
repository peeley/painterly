import { Tool, MouseEventType } from './Tool';
import { fabric } from 'fabric';

export class RectTool extends Tool {
    private startX: number;
    private startY: number;
    private stroke: fabric.Rect;
    constructor() {
        super();
        this.displayName = 'Rectangle';
        this.startX = 0;
        this.startY = 0;
        this.mouseDown = false;
        this.stroke = new fabric.Rect();
    }
    select = (_: fabric.Canvas) => { }
    deselect = (_: fabric.Canvas) => { }
    handleEvent(type: MouseEventType, event: any, context: fabric.Canvas): fabric.Rect | void {
        const pointer = context.getPointer(event.e);
        const xCoord = pointer.x;
        const yCoord = pointer.y;
        if (type === "mouse:down") {
            this.mouseDown = true;
            this.startX = xCoord;
            this.startY = yCoord;
            this.stroke.set({
                fill: this.color,
                left: xCoord,
                top: yCoord,
            });
            context.add(this.stroke);
        }
        else if (this.mouseDown && type === "mouse:move") {
            const width = xCoord - this.startX;
            const height = yCoord - this.startY;
            this.stroke.set({
                width: width,
                height: height,
            });
            // firing an event on mouse move is really taxing
            // maybe just send single `object:added` event here?
        }
        else if (type === 'mouse:up') {
            context.fire('push:added', { target: this.stroke });
            this.stroke = new fabric.Rect();
            this.mouseDown = false;
        }
        context.renderAll();
    }
}
