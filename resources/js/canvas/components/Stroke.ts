export default class Stroke{
    protected type: string;
    protected indicator: boolean = false;
    protected color: string;
    protected coords: Array<Array<number>> = [];
    constructor(type: string, color: string){
        this.type = type;
        this.color = color;
    }
    reset(){
        this.coords = [];
        this.indicator = false;
    }
    pushCoords(coords: Array<number>){
        this.coords.push(coords);
    }
    setColor(color: string){
        this.color = color;
    }
    getColor(): string {
        return this.color;
    }
    getType(): string {
        return this.type;
    }
    setIndicator(indicator: boolean){
        this.indicator = indicator;
    }
    getIndicator(): boolean {
        return this.indicator;
    }
    redoStroke(_: CanvasRenderingContext2D){}
}
