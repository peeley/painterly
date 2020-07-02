import { Tool } from './Tool';
import Stroke from './Stroke';

export class PanTool extends Tool {
    private lastX: number;
    private lastY: number;
    private shiftedX: number;
    private shiftedY: number;
    private stroke: PanStroke;
    constructor(){
        super('pan');
        this.toolName = 'pan';
        this.displayName = 'Pan';
        this.mouseDown = false;
        this.lastX = 0;
        this.lastY = 0;
        this.shiftedX = 0;
        this.shiftedY = 0;
        this.stroke = new PanStroke();
    }
    handleEvent(event: any, context: CanvasRenderingContext2D): PanStroke|void {
        const xCoord = event.clientX / event.scaleFactor;
        const yCoord = event.clientY / event.scaleFactor;
        if(!this.mouseDown && (event.buttons === 1 || event.buttons === 4)){
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
                this.stroke.shiftedX = this.shiftedX;
                this.stroke.shiftedY = this.shiftedY;
                context.translate(deltaX, deltaY);
            }
            else if(!this.isInsideWidthBounds(this.shiftedX - deltaX, context) &&
                    this.isInsideHeightBounds(this.shiftedY - deltaY, context)){
                this.shiftedY -= deltaY;
                this.stroke.shiftedY = this.shiftedY;
                context.translate(0, deltaY);
            }
            else if(this.isInsideWidthBounds(this.shiftedX - deltaX, context) &&
                    !this.isInsideHeightBounds(this.shiftedY - deltaY, context)){
                this.shiftedX -= deltaX;
                this.stroke.shiftedX = this.shiftedX;
                context.translate(deltaX, 0);
            }
        }
        this.stroke.setIndicator(true);
        return this.stroke;
    }
    isInsideWidthBounds(coord: number, context: CanvasRenderingContext2D): boolean {
        return (coord > 0 && coord < context.canvas.width);
    }
    isInsideHeightBounds(coord: number, context: CanvasRenderingContext2D): boolean {
        return (coord > 0 && coord < context.canvas.height);
    }
}

export class PanStroke extends Stroke {
    public shiftedX: number;
    public shiftedY: number;
    constructor(){
        super('pan', '');
        this.shiftedX = 0;
        this.shiftedY = 0;
    }
    setLeftOffset(left: number){
        this.shiftedX = left;
    }
    setTopOffset(top: number){
        this.shiftedY = top;
    }
}
