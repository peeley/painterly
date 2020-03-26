
export class Tool {
    constructor(strokeType){
        this.strokeType = strokeType;
        this.mouseDown = false;
        this.color = "#42445A";
        this.currentStroke = {
            type: this.strokeType,
            indicator: false,
            color: this.color,
            strokeWidth: 1,
            coords: []
        }
    }
    resetStroke = () => {
        this.currentStroke = {
            type: this.strokeType,
            color: this.getColor(),
            strokeWidth: this.getStrokeWidth(),
        }
    }
    setOffsets = (drawSurface) => {
        let rect = drawSurface.current.getBoundingClientRect();
        this.topOffset = rect.top;
        this.leftOffset = rect.left;
    }
    setColor = (color) => {
        this.color = color;
        this.currentStroke.color = this.color;
    }
    getColor = () => {
        return this.color;
    }
    setStrokeWidth = (width) => {
        this.strokeWidth = width;
        this.currentStroke.strokeWidth = this.strokeWidth;
    }
    getStrokeWidth = () => {
        return this.strokeWidth;
    }
    handleEvent(event, context){}
}
