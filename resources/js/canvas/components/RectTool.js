import { Tool } from './Tool.ts';
import Stroke from './Stroke.ts';

export class RectTool extends Tool {
    constructor(){
        super('rect');
        this.displayName = 'Rectangle';
        this.startX = null;
        this.startY = null;
        this.mouseDown = false;
        this.stroke = new RectStroke(this.color);
    }
    handleEvent = (event, context) => {
        const xCoord = Math.floor((event.clientX - event.leftOffset) / event.scaleFactor);
        const yCoord = Math.floor((event.clientY - event.topOffset) / event.scaleFactor);
        if(event.type === "mousedown"){
            context.beginPath();
            this.mouseDown = true;
            this.startX = xCoord;
            this.startY = yCoord;
            this.stroke.pushCoords([xCoord, yCoord]);
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
                this.stroke = new RectStroke(this.color);
                finishedStroke.setIndicator(false);
                this.mouseDown = false;
            }
            else{
                finishedStroke.setIndicator(true);
            }
            return finishedStroke;
        }
    }
}

export class RectStroke extends Stroke {
    constructor(color){
        super('rect', color);
        this.width = 0;
        this.height = 0;
    }
    redoStroke = (context) => {
        const [[x, y]] = this.coords;
        context.save();
        context.fillStyle = this.color;
        context.fillRect(x, y, this.width, this.height);
        context.restore();
    }
    setWidth = (width) => {
        this.width = width;
    }
    setHeight = (height) => {
        this.height = height;
    }
    serialize = () => {
        return {
            type: this.type,
            indicator: this.indicator,
            color: this.color,
            height: this.height,
            width: this.width,
            coords: this.coords
        };
    }
    deserialize = (json) => {
        this.type = json.type;
        this.indicator = json.indicator;
        this.color = json.color;
        this.height = json.height;
        this.width = json.width;
        this.coords = json.coords;
    }
}
