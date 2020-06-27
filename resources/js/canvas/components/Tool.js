
export class Tool {
    constructor(strokeType){
        this.strokeType = strokeType;
        this.mouseDown = false;
        this.color = "rgba(66, 68, 90, 1)";
        this.stroke = new Stroke(this.strokeType, this.color);
    }
    setColor = (color) => {
        this.stroke.setColor(this.color);
    }
    getColor = () => {
        return this.stroke.getColor();
    }
    setStrokeWidth = (width) => {
        this.stroke.setStrokeWidth(this.strokeWidth);
    }
    getStrokeWidth = () => {
        return this.stroke.getStrokeWidth();
    }
    handleEvent(event, context){}
}
