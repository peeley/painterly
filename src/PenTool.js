import { Tool } from './Tool.js';

export class PenTool extends Tool {
    constructor(){
        super('pen');
        this.toolName = 'pen';
        this.strokeWidth = 1;
        this.handleEvent = this.handleEvent.bind(this);
        this.joinType = 'round';
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
            this.currentStroke.coords = [(xCoord, yCoord)];
        }
        else if(event.type === "wheel"){
            if(event.deltaY > 0 && this.strokeWidth > 1){
                this.strokeWidth -= 1; 
            }
            else if(event.deltaY < 0 && this.strokeWidth < 30){
                this.strokeWidth += 1;
            }
        }
        else if(event.type === "mouseup"){
            this.mouseDown = false;
            let finishedStroke = this.currentStroke;
            this.resetStroke();
            return finishedStroke;
        }
        else if(this.mouseDown && event.type === "mousemove"){
            context.lineWidth = this.strokeWidth;
            let xCoord = event.clientX - this.leftOffset;
            let yCoord = event.clientY - this.topOffset;
            context.lineTo(xCoord, yCoord);
            context.stroke();
            this.currentStroke.coords.push((xCoord, yCoord));
        }
    }   
    static redoStroke(stroke, context){
        console.log('redoing pen stroke!');
    }
}
