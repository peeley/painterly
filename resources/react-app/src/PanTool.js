import { Tool } from './Tool.js';

export class PanTool extends Tool {
    constructor(){
        super('pan');
        this.toolName = 'pan';
        this.displayName = 'Pan';
        this.mouseDown = false;
        this.lastX = null;
        this.lastY = null;
    }
    handleEvent = (event, context) => {
        if(!this.mouseDown && (event.buttons === 1 || event.buttons === 4)){
            this.mouseDown = true;
            this.lastX = event.clientX - this.leftOffset;
            this.lastY = event.clientY - this.topOffset;
        }
        else if(event.type === 'mouseup'){
            this.mouseDown = false;
        }
        else if(this.mouseDown && event.type === 'mousemove'){
            const xCoord = event.clientX - this.leftOffset;
            const yCoord = event.clientY - this.topOffset;
            const deltaX = xCoord - this.lastX;
            const deltaY = yCoord - this.lastY;
            context.translate(deltaX, deltaY);
            this.lastX = xCoord;
            this.lastY = yCoord;
            return { indicator: true };
        }
    }
}
