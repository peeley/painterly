import { fabric } from 'fabric';
import { MouseInputType } from "./Tools/MouseInputType";

export class PanHandler {
    private lastX: number;
    private lastY: number;
    private panning: boolean;
    constructor() {
        this.lastX = 0;
        this.lastY = 0;
        this.panning = false;
    }
    pan(type: MouseInputType, event: any, canvas: fabric.Canvas) {
        const xCoord = event.e.clientX;
        const yCoord = event.e.clientY;

        if (type === 'mouse:down') {
            this.lastX = xCoord;
            this.lastY = yCoord;
            this.panning = true;
        }
        else if (type === 'mouse:move') {
            const deltaX = xCoord - this.lastX;
            const deltaY = yCoord - this.lastY;
            let transformationMatrix = canvas.viewportTransform;

            if (!transformationMatrix) {
                return;
            }

            transformationMatrix[4] += deltaX;
            transformationMatrix[5] += deltaY;
            canvas.requestRenderAll();
            this.lastX = xCoord;
            this.lastY = yCoord;
        }
        else {
            this.panning = false;
        }
    }
    isPanning(): boolean {
        return this.panning;
    }
}
