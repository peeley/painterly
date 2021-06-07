import { Tool } from './Tool';
import { MouseInputType } from "./MouseInputType";
import { fabric } from 'fabric';

const PointLength = 15;

export class ArrowTool extends Tool {
    private stem: fabric.Line;
    private leftPointHalf: fabric.Line;
    private rightPointHalf: fabric.Line;
    constructor(){
        super();
        this.displayName = 'Arrow';
        this.displayIcon = 'fas fa-long-arrow-alt-right';
        this.mouseDown = false;
        this.stem = new fabric.Line();
        this.leftPointHalf = new fabric.Line();
        this.rightPointHalf = new fabric.Line();
    }
    select(_: fabric.Canvas){}
    deselect(_: fabric.Canvas){}
    handleEvent(type: MouseInputType, event: any, canvas: fabric.Canvas): fabric.Line | void {
        const pointer = canvas.getPointer(event.e);
        const xCoord = pointer.x;
        const yCoord = pointer.y;
        if (type === "mouse:down") {
            this.mouseDown = true;
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
            canvas.add(this.stem);
            canvas.add(this.leftPointHalf);
            canvas.add(this.rightPointHalf);
        }
        else if (this.mouseDown && type === "mouse:move") {
            this.stem.set({
                x2: xCoord,
                y2: yCoord,
            });
            let pointEnd = this.calculatePointCoords(this.stem, 'left');
            this.leftPointHalf.set({
                x1: xCoord,
                y1: yCoord,
                x2: xCoord + pointEnd.y - pointEnd.x,
                y2: yCoord + pointEnd.x + pointEnd.y
            });
            this.rightPointHalf.set({
                x1: xCoord,
                y1: yCoord,
                x2: xCoord + pointEnd.y + pointEnd.x,
                y2: yCoord + pointEnd.x - pointEnd.y
            });
        }
        else if (type === 'mouse:up') {
            this.stem.setCoords();
            // TODO perhaps add all objects as a group? will fix selection, but
            // opens up pandora's box when it comes to transforming
            canvas.fire('push:added', { target: [this.stem, this.leftPointHalf, this.rightPointHalf] });
            this.stem = new fabric.Line();
            this.leftPointHalf = new fabric.Line();
            this.rightPointHalf = new fabric.Line();
            this.mouseDown = false;
        }
        canvas.renderAll();
    }
    private calculatePointCoords(hypotenuse: fabric.Line, side: 'left'|'right'): fabric.Point {
        let width = (hypotenuse.x2 as number) - (hypotenuse.x1 as number);
        let height = (hypotenuse.y1 as number) - (hypotenuse.y2 as number);

        let theta = Math.atan2(height, width);
        let phi = Math.PI / 2;

        let moveX = Math.cos(theta - phi) * PointLength;
        let moveY = Math.sin(theta - phi) * PointLength;

        return new fabric.Point(moveX, moveY);
    }
}
