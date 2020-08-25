export class PanHandler {
    private lastX: number;
    private lastY: number;
    private shiftedX: number;
    private shiftedY: number;
    private mouseDown: boolean;
    constructor() {
        this.mouseDown = false;
        this.lastX = 0;
        this.lastY = 0;
        this.shiftedX = 0;
        this.shiftedY = 0;
    }
    pan(event: any, context: CanvasRenderingContext2D): [number, number] {
        const xCoord = event.clientX / event.scaleFactor;
        const yCoord = event.clientY / event.scaleFactor;
        if (!this.mouseDown) {
            this.mouseDown = true;
            this.lastX = xCoord;
            this.lastY = yCoord;
        }
        else if (event.type === 'mouseup') {
            this.mouseDown = false;
        }
        else if (this.mouseDown && event.type === 'mousemove') {
            const deltaX = xCoord - this.lastX;
            const deltaY = yCoord - this.lastY;
            this.lastX = xCoord;
            this.lastY = yCoord;
            if (this.isInsideWidthBounds(this.shiftedX - deltaX, context, event.scaleFactor) &&
                this.isInsideHeightBounds(this.shiftedY - deltaY, context, event.scaleFactor)) {
                this.shiftedX -= deltaX;
                this.shiftedY -= deltaY;
                context.translate(deltaX, deltaY);
            }
            else if (!this.isInsideWidthBounds(this.shiftedX - deltaX, context, event.scaleFactor) &&
                this.isInsideHeightBounds(this.shiftedY - deltaY, context, event.scaleFactor)) {
                this.shiftedY -= deltaY;
                context.translate(0, deltaY);
            }
            else if (this.isInsideWidthBounds(this.shiftedX - deltaX, context, event.scaleFactor) &&
                !this.isInsideHeightBounds(this.shiftedY - deltaY, context, event.scaleFactor)) {
                this.shiftedX -= deltaX;
                context.translate(deltaX, 0);
            }
        }
        return [this.shiftedX, this.shiftedY];
    }
    isInsideWidthBounds(coord: number, context: CanvasRenderingContext2D, scale: number): boolean {
        const viewLeftBound = coord;
        const viewRightBound = coord + (context.canvas.width / scale);
        return (viewLeftBound > 0 && viewRightBound < context.canvas.width);
    }
    isInsideHeightBounds(coord: number, context: CanvasRenderingContext2D, scale: number): boolean {
        const viewTopBound = coord;
        const viewBottomBound = coord + (context.canvas.height / scale);
        return (viewTopBound > 0 && viewBottomBound < context.canvas.height);
    }
    resetDistanceShifted() {
        this.shiftedY = 0;
        this.shiftedX = 0;
    }
}
