import { Tool } from './Tool.js';

export class PenTool extends Tool {
    constructor(){
        super('pen');
        this.toolName = 'pen';
        this.displayName = 'Pen';
        this.strokeWidth = 3;
        this.joinType = 'round';
    }
    handleEvent = (event, context) => {
        const xCoord = (event.clientX - event.leftOffset) / event.scaleFactor;
        const yCoord = (event.clientY - event.topOffset) / event.scaleFactor;
        console.log(JSON.stringify(event));
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
            this.stroke.resetStroke();
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
    static redoStroke(stroke, context){
        const color = stroke.color;
        const width = stroke.strokeWidth;
        const startCoords = stroke.coords[0];
        context.save();
        context.strokeStyle = color;
        context.lineWidth = width;
        context.beginPath();
        context.moveTo(startCoords[0], startCoords[1]);
        for(let coord of stroke.coords.slice(1)){
            context.lineTo(coord[0], coord[1]);
        }
        context.stroke();
        context.restore();
    }
}
