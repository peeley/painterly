import { Tool } from './Tool.js';

export class FillTool extends Tool {
    constructor(){
        super('fill');
        this.toolName = 'fill';
    }
    handleEvent = (event, context) => {
        if(event.type === 'mousedown'){
            const xCoord = event.clientX - this.leftOffset;
            const yCoord = event.clientY - this.topOffset;
            const imgPixels = context.getImageData(xCoord, yCoord, 1, 1).data;
            console.log(imgPixels);
        }
    }

    floodFill = (pixels, x, y, backgroundColor) => {
        // TODO: floodfill algorithm
    }
}
