export default class Stroke{
    protected type: string;
    protected indicator: boolean;
    protected color: string;
    protected coords: Array<Array<number>>;
    constructor(type: string, color: string){
        this.type = type;
        this.indicator = false;
        this.color = color;
        this.coords = [];
    }
    reset = () => {
        this.coords = [];
        this.indicator = false;
    }
    pushCoords = (coords: Array<number>) => {
        this.coords.push(coords);
    }
    setColor = (color: string) => {
        this.color = color;
    }
    getColor = () => {
        return this.color;
    }
    setIndicator = (indicator: boolean) => {
        this.indicator = indicator;
    }
    redoStroke = (context: CanvasRenderingContext2D) => {}
}
