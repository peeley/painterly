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
        if(event.type === "mousedown"){
            context.beginPath();
            this.mouseDown = true;
            this.startX = event.clientX - this.leftOffset;
            this.startY = event.clientY - this.topOffset;
            this.currentStroke.coords = [this.startX, this.startY];
        }
        else if(event.type === "mouseup" || 
                (this.mouseDown && event.type === "mousemove")){
            context.fillStyle = this.color;
            const width = (event.clientX - this.leftOffset) - this.startX;
            const height = (event.clientY - this.topOffset) - this.startY;
            context.fillRect(this.startX, this.startY, width, height);
            this.currentStroke.width = width;
            this.currentStroke.height = height;
            const finishedStroke = this.currentStroke;
            if(event.type === "mouseup"){
                finishedStroke.indicator = false;
                this.resetStroke();
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
