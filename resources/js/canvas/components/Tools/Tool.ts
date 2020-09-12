import { fabric } from 'fabric';

export type MouseEventType = 'mouse:down' | 'mouse:move' | 'mouse:up';

export abstract class Tool {
    protected strokeType: string;
    protected mouseDown: boolean;
    protected color: string;
    public toolName: string;
    protected displayName: string;
    protected strokeWidth: number;
    constructor(strokeType: string) {
        this.strokeType = strokeType;
        this.mouseDown = false;
        this.color = "rgba(17, 17, 17, 1)";
        this.strokeWidth = 1;
        this.toolName = 'generic';
        this.displayName = 'tool';
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
    abstract handleEvent(_type: MouseEventType, _event: any, ___: fabric.Canvas): fabric.Object | void;
}
