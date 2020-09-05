import { fabric } from 'fabric';

export interface CanvasInputEvent {
    clientX: number,
    clientY: number,
    leftOffset: number,
    topOffset: number,
    scaleFactor: number,
    buttons: number,
    type: string,
};

export abstract class Tool {
    protected strokeType: string;
    protected mouseDown: boolean;
    protected color: string;
    public toolName: string;
    protected displayName: string;
    protected strokeWidth: number;
    constructor(strokeType: string){
        this.strokeType = strokeType;
        this.mouseDown = false;
        this.color = "rgba(17, 17, 17, 1)";
        this.strokeWidth = 1;
        this.toolName = 'generic';
        this.displayName = 'tool';
    }
    abstract select(canvas: fabric.Canvas);
    abstract deselect(canvas: fabric.Canvas);
    setColor = (color: string) => {
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
    }
    abstract handleEvent(_: string, __: any, ___: fabric.Canvas): fabric.Object |void;
}
