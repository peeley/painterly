import { Tool } from './Tool.js';

export class PenTool extends Tool {
    constructor(drawSurfaceRef){
        super(drawSurfaceRef);
        this.dotSize = 1;
        this.handleEvent = this.handleEvent.bind(this);
        this.getStrokeWidth = this.getStrokeWidth.bind(this);
        this.setStrokeWidth = this.setStrokeWidth.bind(this);
        this.joinType = 'round';
    }
    setStrokeWidth(width){
        this.dotSize = width;
    }
    getStrokeWidth(){
        return this.dotSize;
    }
    handleEvent(event, context){
        if(event.type === "mousedown"){
            this.mouseDown = true;
            context.save();
            context.beginPath();
            context.lineCap = 'round';
            context.lineJoin = this.joinType;
            context.strokeStyle = this.color;
            context.moveTo(event.clientX - this.leftOffset, 
                           event.clientY - this.topOffset);
        }
        else if(event.type === "wheel"){
            if(event.deltaY > 0 && this.dotSize > 1){
                this.dotSize -= 1; 
            }
            else if(event.deltaY < 0 && this.dotSize < 30){
                this.dotSize += 1;
            }
        }
        else if(event.type === "mouseup" || event.type === "mouseleave"){
            this.mouseDown = false;
        }
        else if(this.mouseDown && event.type === "mousemove"){
            context.lineWidth = this.dotSize;
            context.lineTo(event.clientX - this.leftOffset, 
                           event.clientY - this.topOffset);
            context.stroke();
        }
    }   
}
