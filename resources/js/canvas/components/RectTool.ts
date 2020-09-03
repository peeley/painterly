import { Tool } from './Tool';
import Stroke from './Stroke';
import { fabric } from 'fabric';

export class RectTool extends Tool {
    private startX: number;
    private startY: number;
    private stroke: RectStroke;
    constructor(){
        super('rect');
        this.displayName = 'Rectangle';
        this.startX = 0;
        this.startY = 0;
        this.mouseDown = false;
        this.stroke = new RectStroke(this.color);
    }
    // TODO define event type
    handleEvent(type: string, event: any, context: fabric.Canvas): fabric.Rect | void {
        const xCoord = Math.floor((event.clientX - event.leftOffset) / event.scaleFactor);
        const yCoord = Math.floor((event.clientY - event.topOffset) / event.scaleFactor);
        if(event.type === "mousedown"){
            this.mouseDown = true;
            this.startX = xCoord;
            this.startY = yCoord;
            this.stroke.setColor(this.color);
            this.stroke.pushCoords([xCoord, yCoord]);
            this.stroke.setIndicator(true);
        }
        else if(event.type === "mouseup" ||
                (this.mouseDown && event.type === "mousemove")){
            const width = xCoord - this.startX;
            const height = yCoord - this.startY;
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
            //return finishedStroke;
        }
    }
}

export class RectStroke extends Stroke {
    private width: number;
    private height: number;
    constructor(color: string){
        super('rect', color);
        this.width = 0;
        this.height = 0;
    }
    redoStroke = (context: CanvasRenderingContext2D) => {
        const [[x, y]] = this.coords;
        context.save();
        context.fillStyle = this.color;
        context.fillRect(x, y, this.width, this.height);
        context.restore();
    }
    setWidth = (width: number) => {
        this.width = width;
    }
    setHeight = (height: number) => {
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
    deserialize = (json: any) => {
        this.type = json.type;
        this.indicator = json.indicator;
        this.color = json.color;
        this.height = json.height;
        this.width = json.width;
        this.coords = json.coords;
    }
}
