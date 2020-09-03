import { fabric } from 'fabric';

export class PanHandler {
    private lastX: number;
    private lastY: number;
    constructor() {
        this.lastX = 0;
        this.lastY = 0;
    }
    pan(type: string, event: any, context: fabric.Canvas) {
        const xCoord = event.e.clientX;
        const yCoord = event.e.clientY;
        if (type === 'mouse:down') {
            this.lastX = xCoord;
            this.lastY = yCoord;
        }
        else {
            const deltaX = xCoord - this.lastX;
            const deltaY = yCoord - this.lastY;
            let transform = context.viewportTransform;
            if (!transform) {
                return;
            }
            transform[4] += deltaX;
            transform[5] += deltaY;
            context.requestRenderAll();
            this.lastX = xCoord;
            this.lastY = yCoord;
        }
    }
}
