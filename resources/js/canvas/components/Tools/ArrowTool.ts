import { Tool, MouseEventType } from './Tool';
import { fabric } from 'fabric';

const PointLength = 5;

export class ArrowTool extends Tool {
    private startX: number;
    private startY: number;
    private stem: fabric.Line;
    private leftPointHalf: fabric.Line;
    private rightPointHalf: fabric.Line;
    constructor(){
        super();
        this.startX = 0;
        this.startY = 0;
        this.displayName = 'Arrow';
        this.displayIcon = 'fas fa-long-arrow-alt-right';
        this.mouseDown = false;
        this.stem = new fabric.Line();
        this.leftPointHalf = new fabric.Line();
        this.rightPointHalf = new fabric.Line();
    }
    select(_: fabric.Canvas){}
    deselect(_: fabric.Canvas){}
    handleEvent(type: MouseEventType, event: any, context: fabric.Canvas): fabric.Line | void {
        const pointer = context.getPointer(event.e);
        const xCoord = pointer.x;
        const yCoord = pointer.y;
        if (type === "mouse:down") {
            this.mouseDown = true;
            this.startX = xCoord;
            this.startY = yCoord;
            this.stem.set({
                stroke: this.color,
                strokeWidth: this.strokeWidth,
                strokeLineCap: 'round',
                x1: xCoord,
                y1: yCoord,
                x2: xCoord,
                y2: yCoord,
            });
            this.leftPointHalf.set({
                stroke: this.color,
                strokeWidth: this.strokeWidth,
                strokeLineCap: 'round',
                x1: xCoord,
                y1: yCoord,
                x2: xCoord,
                y2: yCoord,
            });
            this.rightPointHalf.set({
                stroke: this.color,
                strokeWidth: this.strokeWidth,
                strokeLineCap: 'round',
                x1: xCoord,
                y1: yCoord,
                x2: xCoord,
                y2: yCoord,
            });
            context.add(this.stem);
            context.add(this.leftPointHalf);
            context.add(this.rightPointHalf);
        }
        else if (this.mouseDown && type === "mouse:move") {
            this.stem.set({
                x2: xCoord,
                y2: yCoord,
            });
        }
        else if (type === 'mouse:up') {
            this.stem.setCoords();
            context.fire('push:added', { target: [this.stem] });
            this.stem = new fabric.Line();
            this.mouseDown = false;
        }
        context.renderAll();
    }
    private calculatePointHalfCoords(point: fabric.Point,
                                     angle: number): fabric.Point {

        // TODO
        return new fabric.Point(point.x, point.y);
    }
}
