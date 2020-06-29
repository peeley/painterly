import Stroke from './Stroke.ts';

export class Tool {
    constructor(strokeType){
        this.strokeType = strokeType;
        this.mouseDown = false;
        this.color = "rgba(66, 68, 90, 1)";
        this.strokeWidth = 0;
        this.stroke = new Stroke(this.strokeType, 0, this.color);
    }
    setColor = (color) => {
        // TODO kind of a code smell, shouldn't be duplicated
        this.color = color;
        this.stroke.setColor(color);
    }
    getColor = () => {
        return this.color;
    }
    setStrokeWidth = (width) => {
        this.strokeWidth = width;
        this.stroke.setStrokeWidth(this.strokeWidth);
    }
    getStrokeWidth = () => {
        return this.stroke.getStrokeWidth();
    }
    handleEvent(event, context){}
}
