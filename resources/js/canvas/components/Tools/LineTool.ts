import {Tool, MouseEventType} from './Tool';
import { fabric } from 'fabric';

export class LineTool extends Tool {
    private startX: number;
    private startY: number;
    private stroke: fabric.Line;
    constructor(){
        super();
        this.startX = 0;
        this.startY = 0;
        this.displayName = 'Line';
        this.displayIcon = 'fas fa-ruler';
        this.mouseDown = false;
        this.stroke = new fabric.Line;
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
            this.stroke.set({
                stroke: this.color,
                strokeWidth: this.strokeWidth,
                strokeLineCap: 'round',
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
        }
        else if (type === 'mouse:up') {
            this.stroke.setCoords();
            context.fire('push:added', { target: this.stroke });
            this.stroke = new fabric.Line();
            this.mouseDown = false;
        }
        context.renderAll();
    }
}
