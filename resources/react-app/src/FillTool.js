import { Tool } from './Tool.js';

// converts hexadecimal string to RGBA array
let hexToRGBA = (color) => {
    let strRGBA = color.split('(')[1].split(')')[0].split(',')
    return strRGBA.map( item => +item); // + is unary operator for numeric cast
}

// determines equality of two colors in RGBA array format
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
        let [x, y] = fillQueue.shift();
        const imgData = context.getImageData(x, y, 1, 1);
        const pixelColor = imgData.data;
        if(x < 0 || y < 0 || x > width || y > height){
            continue;
        }
        else if(colorsEqual(pixelColor, fillColor)){ 
            continue;
        }
        else if(colorsEqual(pixelColor, backgroundColor)){
            console.log(`filling pixel at ${x},${y} with ${fillColor}`);
            console.log(`imgData before: `, context.getImageData(x, y, 1, 1));
            for(let i = 0; i < pixelColor.length; i++){
                console.log(pixelColor[i], fillColor[i]);
                pixelColor[i] = fillColor[i];
            }
            console.log(imgData.data);
            context.putImageData(imgData, x, y);
            console.log(`imgData after: `, context.getImageData(x, y, 1, 1));
            fillQueue.push([x+1, y]);
            fillQueue.push([x, y+1]);
            fillQueue.push([x-1, y]);
            fillQueue.push([x, y-1]);
        }
        iterIndex += 1;
    }
}
export class FillTool extends Tool {
    constructor(){
        super('fill');
        this.toolName = 'fill';
        this.displayName = 'Fill';
    }
    handleEvent = (event, context) => {
        if(event.type === 'mousedown'){
            const xCoord = Math.floor(event.clientX - this.leftOffset);
            const yCoord = Math.floor(event.clientY - this.topOffset);
            const backgroundColor = context.getImageData(xCoord, yCoord, 1, 1).data;
            this.currentStroke.color = hexToRGBA(this.color);
            console.log(`filling ${backgroundColor} from ${xCoord},${yCoord} 
                with ${this.currentStroke.color}`);
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

