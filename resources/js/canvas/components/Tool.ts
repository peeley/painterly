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
    getColor(): string {
        return this.color;
    }
    getStrokeWidth(): number {
        return this.strokeWidth;
    }
    setStrokeWidth(width: number){
        this.strokeWidth = width;
        console.log(`set width to ${this.strokeWidth}`);
    }
    handleEvent(event: any, context: CanvasRenderingContext2D){}
}
