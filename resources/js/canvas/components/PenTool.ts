import { Tool } from './Tool';
import Stroke from './Stroke';

export class PenTool extends Tool {
    private readonly joinType: CanvasLineJoin = 'round';
    private readonly lineCap: CanvasLineCap = 'round';
    private stroke: PenStroke;
    constructor(){
        super('pen');
        this.displayName = 'Pen';
        this.strokeWidth = 3;
        this.stroke = new PenStroke(this.strokeWidth, this.color);
    }
    handleEvent(event: any, context: CanvasRenderingContext2D): PenStroke {
        const xCoord = (event.clientX - event.leftOffset) / event.scaleFactor;
        const yCoord = (event.clientY - event.topOffset) / event.scaleFactor;
        if(event.type === "mousedown"){
            this.mouseDown = true;
            context.save();
            context.beginPath();
            context.lineWidth = this.strokeWidth;
            context.lineCap = this.lineCap;
            context.lineJoin = this.joinType;
            context.strokeStyle = this.color;
            context.moveTo(xCoord, yCoord);
            this.stroke.setColor(this.color);
            this.stroke.setStrokeWidth(this.strokeWidth);
            this.stroke.pushCoords([xCoord, yCoord]);
            this.stroke.setIndicator(true);
        }
        else if((event.type === "mouseup" || event.type === "mouseleave") && this.mouseDown){
            this.mouseDown = false;
            let finishedStroke = this.stroke;
            finishedStroke.setIndicator(false);
            this.stroke = new PenStroke(this.strokeWidth, this.color);
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
        return this.stroke;
    }
}

export class PenStroke extends Stroke {
    private strokeWidth: number;
    constructor(width: number, color: string){
        super('pen', color);
        this.strokeWidth = width;
    }
    setStrokeWidth = (width: number) => {
        this.strokeWidth = width;
    }
    getStrokeWidth = (): number => {
        return this.strokeWidth;
    }
    redoStroke = (context: CanvasRenderingContext2D) => {
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
    serialize = () => {
        return {
            type: this.type,
            indicator: this.indicator,
            color: this.color,
            strokeWidth: this.strokeWidth,
            coords: this.coords
        };
    }
    // TODO create type for serialized PenStroke
    deserialize = (json: any) => {
        this.type = json.type;
        this.indicator = json.indicator;
        this.color = json.color;
        this.strokeWidth = json.strokeWidth;
        this.coords = json.coords;
    }
}
