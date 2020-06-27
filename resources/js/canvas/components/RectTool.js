import { Tool } from './Tool.js';

export class RectTool extends Tool {
    constructor(){
        super('rect');
        this.toolName = 'rect';
        this.displayName = 'Rectangle';
        this.startX = null;
        this.startY = null;
        this.mouseDown = false;
    }
    handleEvent = (event, context) => {
        const xCoord = (event.clientX - event.leftOffset) / event.scaleFactor;
        const yCoord = (event.clientY - event.topOffset) / event.scaleFactor;
        if(event.type === "mousedown"){
            context.beginPath();
            this.mouseDown = true;
            this.startX = xCoord;
            this.startY = yCoord;
            this.stroke.pushCoords([this.startX, this.startY]);
        }
        else if(event.type === "mouseup" || 
                (this.mouseDown && event.type === "mousemove")){
            context.fillStyle = this.color;
            const width = xCoord - this.startX;
            const height = yCoord - this.startY;
            context.fillRect(this.startX, this.startY, width, height);
            this.stroke.setWidth(width);
            this.stroke.setHeight(height);
            let finishedStroke = this.stroke;
            if(event.type === "mouseup"){
                finishedStroke.indicator = false;
                this.stroke.resetStroke();
                this.mouseDown = false;
            }
            else{
                finishedStroke.indicator = true;
            }
            return finishedStroke;
        }
    }
    static redoStroke(stroke, context){
        const color = stroke.color;
        const [x, y] = stroke.coords;
        const width = stroke.width;
        const height = stroke.height;
        context.save();
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
        context.restore();
    }
}
