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
            const background= context.getImageData(xCoord, yCoord, 1, 1).data;
            this.floodFill(context, xCoord, yCoord, background);
        }
    }

    floodFill = (context, x, y, backgroundColor) => {
        // TODO: floodfill algorithm
        let imgData = context.getImageData(x, y, 1, 1);
        let pixelColor = imgData.data;
        if(!pixelColor){
            return;
        }
        if(pixelColor === backgroundColor){
            const newColor = this.hexToRGBA(this.color);
            for(let i=0; i<pixelColor.length; i++){
                pixelColor[i] = newColor[i];
            }
            context.putImageData(imgData, x, y);
        }
    }

    hexToRGBA = (color) => {
        let strRGBA = color.split('(')[1].split(')')[0].split(',')
        // turns out + in JS is a unary operator for numeric casting, neat
        return strRGBA.map( item => +item);
    }
}
