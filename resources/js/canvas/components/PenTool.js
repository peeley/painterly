import { Tool } from './Tool.js';
import Stroke from './Stroke.js';

export class PenTool extends Tool {
    constructor(){
        super('pen');
        this.toolName = 'pen';
        this.displayName = 'Pen';
        this.strokeWidth = 3;
        this.joinType = 'round';
        this.stroke = new PenStroke('pen', this.strokeWidth, this.color);
    }
    handleEvent = (event, context) => {
        const xCoord = (event.clientX - event.leftOffset) / event.scaleFactor;
        const yCoord = (event.clientY - event.topOffset) / event.scaleFactor;
        if(event.type === "mousedown"){
            this.mouseDown = true;
            context.save();
            context.beginPath();
            context.lineCap = 'round';
            context.lineJoin = this.joinType;
            context.strokeStyle = this.color;
            context.moveTo(xCoord, yCoord);
            this.stroke.pushCoords([xCoord, yCoord]);
        }
        else if((event.type === "mouseup" || event.type === "mouseleave") && this.mouseDown){
            this.mouseDown = false;
            let finishedStroke = this.stroke;
            finishedStroke.indicator = false;
            this.stroke = new PenStroke('pen', this.strokeWidth, this.color);
            return finishedStroke;
        }
        else if(this.mouseDown && event.type === "mousemove"){
            context.lineWidth = this.strokeWidth;
            context.lineTo(xCoord, yCoord);
            this.stroke.pushCoords([xCoord, yCoord]);
            let indicatorStroke = this.stroke;
            indicatorStroke.setIndicator(true);
            return indicatorStroke;
        }
    }
}

class PenStroke extends Stroke {
    constructor(type, width, color){
        super(type, width, color);
    }
    redoStroke = (context) => {
        const startCoords = this.coords[0];
        context.save();
        context.strokeStyle = this.color;
        context.lineWidth = this.strokeWidth;
        context.beginPath();
        context.moveTo(startCoords[0], startCoords[1]);
        for(let coord of this.coords.slice(1)){
            context.lineTo(coord[0], coord[1]);
        }
        context.stroke();
        context.restore();
    }
}
