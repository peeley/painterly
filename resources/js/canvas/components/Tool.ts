import Stroke from './Stroke';
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
        this.color = "rgba(17, 17, 17, 1)";
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
    handleEvent(_: string, __: any, ___: fabric.Canvas): fabric.Object |void {
        //return new Stroke('', '');
    }
}
