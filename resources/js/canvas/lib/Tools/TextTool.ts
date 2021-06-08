import { Tool } from './Tool';
import { MouseInputType } from "./MouseInputType";
import { fabric } from 'fabric';

export class TextTool extends Tool {
    private stroke: fabric.IText;
    constructor() {
        super();
        this.displayName = 'Text';
        this.displayIcon = 'fas fa-font';
        this.stroke = new fabric.IText('');
    }
    select = (_canvas: fabric.Canvas) => { }
    deselect = (_canvas: fabric.Canvas) => { }
    handleEvent(type: MouseInputType, event: any, canvas: fabric.Canvas) {
        const pointer = canvas.getPointer(event.e);
        let xCoord = pointer.x;
        let yCoord = pointer.y;
        if (type === 'mouse:down' && !canvas.getActiveObject()) {
            this.stroke = new fabric.IText('text', {
                left: xCoord,
                top: yCoord,
                fill: this.color,
                fontFamily: "Akzidenz-Grotesk",
            });
            canvas.add(this.stroke);
            canvas.setActiveObject(this.stroke);
        }
        if (type === 'mouse:up') {
            canvas.fire('push:added', { target: [this.stroke] });
            this.stroke = new fabric.IText('');
        }
    }
}
