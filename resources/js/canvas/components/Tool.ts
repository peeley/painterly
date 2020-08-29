import Stroke from './Stroke';

export interface CanvasInputEvent {
    clientX: number,
    clientY: number,
    leftOffset: number,
    topOffset: number,
    scaleFactor: number,
    buttons: number,
    type: string,
};

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
        this.color = "rgba(17, 17, 17, 255)";
        this.strokeWidth = 1;
        this.toolName = 'generic';
        this.displayName = 'tool';
    }
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
    handleEvent(_: CanvasInputEvent, __: CanvasRenderingContext2D): Stroke|void {
        return new Stroke('', '');
    }
}
