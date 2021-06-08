import { Tool } from './Tool';
import { MouseInputType } from "./MouseInputType";
import { fabric } from 'fabric';

export class RectTool extends Tool {
    private startX: number;
    private startY: number;
    private stroke: fabric.Rect;
    constructor() {
        super();
        this.displayName = 'Rectangle';
        this.displayIcon = 'fas fa-vector-square';
        this.startX = 0;
        this.startY = 0;
        this.mouseDown = false;
        this.stroke = new fabric.Rect();
    }
    select = (_: fabric.Canvas) => { }
    deselect = (_: fabric.Canvas) => { }
    handleEvent(
        type: MouseInputType,
        event: any,
        canvas: fabric.Canvas
    ): fabric.Rect | void {
        const pointer = canvas.getPointer(event.e);
        const xCoord = pointer.x;
        const yCoord = pointer.y;
        if (type === "mouse:down") {
            this.mouseDown = true;
            this.startX = xCoord;
            this.startY = yCoord;
            this.stroke.set({
                stroke: this.color,
                strokeWidth: this.strokeWidth,
                strokeLineJoin: 'round',
                fill: "rgba(0,0,0,0)",
                left: xCoord,
                top: yCoord,
            });
            canvas.add(this.stroke);
        }
        else if (this.mouseDown && type === "mouse:move") {
            const width = xCoord - this.startX;
            const height = yCoord - this.startY;
            this.stroke.set({
                width: width,
                height: height,
            });
        }
        else if (type === 'mouse:up') {
            this.stroke.setCoords();
            canvas.fire('push:added', { target: [this.stroke] });
            this.stroke = new fabric.Rect();
            this.mouseDown = false;
        }
        canvas.renderAll();
    }
}
