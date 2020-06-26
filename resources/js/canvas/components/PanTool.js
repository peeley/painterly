import { Tool } from './Tool.js';

export class PanTool extends Tool {
    constructor(){
        super('pan');
        this.toolName = 'pan';
        this.displayName = 'Pan';
        this.mouseDown = false;
        this.lastX = null;
        this.lastY = null;
        this.shiftedX = 0;
        this.shiftedY = 0;
    }
    handleEvent = (event, context) => {
        const xCoord = event.clientX / event.scaleFactor;
        const yCoord = event.clientY / event.scaleFactor;
        if(!this.mouseDown && (event.buttons === 1 || event.buttons === 4)){
            this.mouseDown = true;
            this.lastX = xCoord;
            this.lastY = yCoord;
        }
        else if(event.type === 'mouseup'){
            this.mouseDown = false;
        }
        else if(this.mouseDown && event.type === 'mousemove'){
            const deltaX = xCoord - this.lastX;
            const deltaY = yCoord - this.lastY;
            this.lastX = xCoord;
            this.lastY = yCoord;
            console.log(`delta X: ${deltaX}`);
            console.log(`delta Y: ${deltaY}`);
            if(this.isInsideWidthBounds(this.shiftedX - deltaX, context) &&
               this.isInsideHeightBounds(this.shiftedY - deltaY, context)){
                this.shiftedX -= deltaX;
                this.shiftedY -= deltaY;
                this.currentStroke.leftOffset = this.shiftedX;
                this.currentStroke.topOffset = this.shiftedY;
                context.translate(deltaX, deltaY);
            }
            else if(!this.isInsideWidthBounds(this.shiftedX - deltaX, context) &&
                    this.isInsideHeightBounds(this.shiftedY - deltaY, context)){
                this.shiftedY -= deltaY;
                this.currentStroke.topOffset = this.shiftedY;
                context.translate(0, deltaY);
            }
            else if(this.isInsideWidthBounds(this.shiftedX - deltaX, context) &&
                    !this.isInsideHeightBounds(this.shiftedY - deltaY, context)){
                this.shiftedX -= deltaX;
                this.currentStroke.leftOffset = this.shiftedX;
                context.translate(deltaX, 0);
            }
            this.currentStroke.indicator = true;
            return this.currentStroke;
        }
    }
    isInsideWidthBounds(coord, context){
        return (coord > 0 && coord < context.canvas.width);
    }
    isInsideHeightBounds(coord, context){
        return (coord > 0 && coord < context.canvas.height);
    }
}
