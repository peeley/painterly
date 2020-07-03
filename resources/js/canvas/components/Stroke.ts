export default class Stroke{
    protected type: string;
    protected indicator: boolean = false;
    protected color: string;
    protected coords: Array<[number, number]> = [];
    constructor(type: string, color: string){
        this.type = type;
        this.color = color;
    }
    reset(){
        this.coords = [];
        this.indicator = false;
    }
    pushCoords(coords: [number, number]){
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
    serialize(){}
    // TODO create type for serialized stroke
    deserialize(_: any){}
    redoStroke(_: CanvasRenderingContext2D){}
}
