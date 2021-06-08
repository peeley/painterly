import { fabric } from 'fabric';
import { MouseInputType } from './MouseInputType';

export abstract class Tool {
    protected mouseDown: boolean;
    protected color: string;
    protected displayName: string;
    protected strokeWidth: number;
    protected displayIcon: string;
    constructor() {
        this.mouseDown = false;
        this.color = "rgba(255, 255, 255, 1)";
        this.strokeWidth = 3;
        this.displayName = 'tool';
        this.displayIcon = '';
    }
    abstract select(canvas: fabric.Canvas): void;
    abstract deselect(canvas: fabric.Canvas): void;
    setColor = (color: string) => {
        this.color = color;
    }
    getColor(): string {
        return this.color;
    }
    getStrokeWidth(): number {
        return this.strokeWidth;
    }
    setStrokeWidth(width: number) {
        this.strokeWidth = width;
    }
    getIcon(){
        return this.displayIcon;
    }
    getDisplayName(){
        return this.displayName;
    }
    abstract handleEvent(_type: MouseInputType, _event: any, _canvas: fabric.Canvas): fabric.Object | void;
}
