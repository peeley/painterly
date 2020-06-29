export class Tool {
    protected strokeType: string;
    protected mouseDown: boolean;
    protected color: string;
    protected toolName: string;
    protected displayName: string;
    protected strokeWidth: number;
    constructor(strokeType: string){
        this.strokeType = strokeType;
        this.mouseDown = false;
        this.color = "rgba(66, 68, 90, 1)";
        this.strokeWidth = 1;
        this.toolName = 'generic';
        this.displayName = 'tool';
    }
    setColor = (color: string) => {
        // TODO kind of a code smell, shouldn't be duplicated
        this.color = color;
    }
    getColor = () => {
        return this.color;
    }
    getStrokeWidth(){
        return this.strokeWidth;
    }
    setStrokeWidth(width: number){
        this.strokeWidth = width;
    }
    handleEvent(event: any, context: CanvasRenderingContext2D){}
}
