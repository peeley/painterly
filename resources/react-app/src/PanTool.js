import { Tool } from './Tool.js';

export class PanTool extends Tool {
    constructor(){
        super('pan');
        this.toolName = 'pan';
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
            console.log(event);
            const xCoord = event.clientX - this.leftOffset;
            const yCoord = event.clientY - this.topOffset;
            const deltaX = xCoord - this.lastX;
            const deltaY = yCoord - this.lastY;
            console.log(xCoord, yCoord);
            console.log(deltaX, deltaY);
            context.translate(deltaX, deltaY);
            this.lastX = xCoord;
            this.lastY = yCoord;
        }
    }
}
