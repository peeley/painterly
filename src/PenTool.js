import { Tool } from './Tool.js';

export class PenTool extends Tool {
    constructor(drawSurfaceRef){
        super(drawSurfaceRef);
        this.dotSize = 1;
        this.handleEvent = this.handleEvent.bind(this);
        this.getStrokeWidth = this.getStrokeWidth.bind(this);
        this.setStrokeWidth = this.setStrokeWidth.bind(this);
        this.joinType = 'round';
        this.resetStroke = this.resetStroke.bind(this);
        this.resetStroke();
    }
    setStrokeWidth(width){
        this.dotSize = width;
    }
    getStrokeWidth(){
        return this.dotSize;
    }
    resetStroke(){
        this.currentStroke = {
            type: 'pen',
            color: this.getColor(),
            strokeWidth: this.getStrokeWidth(),
            coords: []
        }
    }
    handleEvent(event, context){
        if(event.type === "mousedown"){
            this.mouseDown = true;
            context.save();
            context.beginPath();
            context.lineCap = 'round';
            context.lineJoin = this.joinType;
            context.strokeStyle = this.color;
            let xCoord = event.clientX - this.leftOffset;
            let yCoord = event.clientY - this.topOffset;
            context.moveTo(xCoord, yCoord);
            this.currentStroke.coords.push((xCoord, yCoord));
        }
        else if(event.type === "wheel"){
            if(event.deltaY > 0 && this.dotSize > 1){
                this.dotSize -= 1; 
            }
            else if(event.deltaY < 0 && this.dotSize < 30){
                this.dotSize += 1;
            }
        }
        else if(event.type === "mouseup"){
            this.mouseDown = false;
            let finishedStroke = this.currentStroke;
            this.resetStroke();
            return finishedStroke;
        }
        else if(this.mouseDown && event.type === "mousemove"){
            context.lineWidth = this.dotSize;
            let xCoord = event.clientX - this.leftOffset;
            let yCoord = event.clientY - this.topOffset;
            context.lineTo(xCoord, yCoord);
            context.stroke();
            this.currentStroke.coords.push((xCoord, yCoord));
        }
    }   
}
