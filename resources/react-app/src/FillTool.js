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
            const background = context.getImageData(xCoord, yCoord, 1, 1).data;
            this.floodFill(context, xCoord, yCoord, background);
        }
    }

    floodFill = (context, xCoord, yCoord, backgroundColor) => {
        // TODO: floodfill algorithm
        const newColor = this.hexToRGBA(this.color);
        let fillQueue = [[xCoord, yCoord]];
        while(fillQueue.length >= 1){
            let [x, y] = fillQueue.pop();
            let imgData = context.getImageData(x, y, 1, 1);
            let pixelColor = imgData.data;
            if(!pixelColor || pixelColor.toString() === newColor.toString()){ 
                continue;
            }
            else if(pixelColor.toString() === backgroundColor.toString()){
                for(let i=0; i<pixelColor.length; i++){
                    pixelColor[i] = newColor[i];
                }
                fillQueue.push([x+1, y]);
                fillQueue.push([x, y+1]);
                fillQueue.push([x-1, y]);
                fillQueue.push([x, y-1]);
            }
        }
    }

    hexToRGBA = (color) => {
        let strRGBA = color.split('(')[1].split(')')[0].split(',')
        // turns out + in JS is a unary operator for numeric casting, neat
        return strRGBA.map( item => +item);
    }
}
