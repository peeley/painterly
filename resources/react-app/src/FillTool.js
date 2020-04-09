import { Tool } from './Tool.js';

let hexToRGBA = (color) => {
    let strRGBA = color.split('(')[1].split(')')[0].split(',')
    // turns out + in JS is a unary operator for numeric casting, neat
    return strRGBA.map( item => +item);
}
let colorsEqual = (color1, color2) => {
    return (
        color1[0] === color2[0] &&
        color1[1] === color2[1] &&
        color1[2] === color2[2] &&
        color1[3] === color2[3]);
}
let floodFill = (context, xCoord, yCoord, fillColor, backgroundColor) => {
    const canvas = context.canvas;
    const [height, width] = [canvas.height, canvas.width];
    let iterIndex = 0;
    let fillQueue = [[xCoord, yCoord]];
    while(fillQueue.length >= 1 && iterIndex < 100){
        let [x, y] = fillQueue.pop();
        let imgData = context.getImageData(x, y, 1, 1);
        console.log(imgData);
        let pixelColor = imgData.data;
        console.log(pixelColor);
        if(x < 0 || y < 0 || x > width || y > height){
            continue;
        }
        else if(colorsEqual(pixelColor, fillColor)){ 
            continue;
        }
        else if(colorsEqual(pixelColor, backgroundColor)){
            console.log(`imgData before: ${JSON.stringify(imgData)}`);
            for(let i = 0; i < pixelColor.length; i++){
                pixelColor[i] = fillColor[i];
            }
            fillQueue.push([x+1, y]);
            fillQueue.push([x, y+1]);
            fillQueue.push([x-1, y]);
            fillQueue.push([x, y-1]);
            console.log(`imgData after: ${JSON.stringify(imgData)}`);
            context.putImageData(imgData, x, y);
        }
        iterIndex += 1;
    }
}
export class FillTool extends Tool {
    constructor(){
        super('fill');
        this.toolName = 'fill';
    }
    handleEvent = (event, context) => {
        if(event.type === 'mousedown'){
            const xCoord = Math.floor(event.clientX - this.leftOffset);
            const yCoord = Math.floor(event.clientY - this.topOffset);
            const backgroundColor = context.getImageData(xCoord, yCoord, 1, 1).data;
            this.currentStroke.color = hexToRGBA(this.color);
            this.currentStroke.coords = [xCoord, yCoord];
            this.currentStroke.backgroundColor = backgroundColor;
            return this.currentStroke;
        }
    }
    static redoStroke(stroke, context){
        const color = stroke.color;
        const backgroundColor = stroke.backgroundColor;
        const [xCoord, yCoord] = stroke.coords;
        floodFill(context, xCoord, yCoord, color, backgroundColor); 
    }
}

