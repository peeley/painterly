
export class Stroke {
    constructor(type, color){
        this.type = type;
        this.indicator = false;
        this.color = color;
        this.strokeWidth = 1;
        this.coords = [];
    }
    reset = () => {
        this.coords = [];
        this.indicator = false;
    }
    pushCoords = (coords) => {
        this.coords.push(coords);
    }
    setColor = (color) => {
        this.color = color;
    }
    getColor = () => {
        return this.color;
    }
    setStrokeWidth = (width) => {
        this.strokeWidth = width;
    }
    getStrokeWidth = () => {
        return this.strokeWidth;
    }
    setIndicator = (indicator) => {
        this.indicator = indicator;
    }
}
