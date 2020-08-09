export class PanHandler {
    private lastX: number;
    private lastY: number;
    private shiftedX: number;
    private shiftedY: number;
    private mouseDown: boolean;
    constructor(){
        this.mouseDown = false;
        this.lastX = 0;
        this.lastY = 0;
        this.shiftedX = 0;
        this.shiftedY = 0;
    }
    pan(event: any, context: CanvasRenderingContext2D): [number, number] {
        const xCoord = event.clientX / event.scaleFactor;
        const yCoord = event.clientY / event.scaleFactor;
        if(!this.mouseDown){
            this.mouseDown = true;
            this.lastX = xCoord;
            this.lastY = yCoord;
        }
        else if(event.type === 'mouseup'){
            this.mouseDown = false;
        }
        else if(this.mouseDown && event.type === 'mousemove'){
            const deltaX = xCoord - this.lastX;
            const deltaY = yCoord - this.lastY;
            this.lastX = xCoord;
            this.lastY = yCoord;
            if(this.isInsideWidthBounds(this.shiftedX - deltaX, context) &&
               this.isInsideHeightBounds(this.shiftedY - deltaY, context)){
                this.shiftedX -= deltaX;
                this.shiftedY -= deltaY;
                context.translate(deltaX, deltaY);
            }
            else if(!this.isInsideWidthBounds(this.shiftedX - deltaX, context) &&
                    this.isInsideHeightBounds(this.shiftedY - deltaY, context)){
                this.shiftedY -= deltaY;
                context.translate(0, deltaY);
            }
            else if(this.isInsideWidthBounds(this.shiftedX - deltaX, context) &&
                    !this.isInsideHeightBounds(this.shiftedY - deltaY, context)){
                this.shiftedX -= deltaX;
                context.translate(deltaX, 0);
            }
        }
        return [this.shiftedX, this.shiftedY];
    }
    isInsideWidthBounds(coord: number, context: CanvasRenderingContext2D): boolean {
        return (coord > 0 && coord < context.canvas.width);
    }
    isInsideHeightBounds(coord: number, context: CanvasRenderingContext2D): boolean {
        return (coord > 0 && coord < context.canvas.height);
    }
    resetDistanceShifted(){
        this.shiftedY = 0;
        this.shiftedX = 0;
    }
}
