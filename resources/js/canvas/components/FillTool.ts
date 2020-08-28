import { Tool } from './Tool';
import Stroke from './Stroke';

type RGBA = Uint8ClampedArray;

// converts hexadecimal string to RGBA array
let hexToRGBA = (color: string): RGBA => {
    let RGBAstr = color.split('(')[1].split(')')[0].split(',');
    let RGBAtuple = RGBAstr.map(item => +item); // + is unary operator for numeric cast
    if(RGBAtuple.length !== 4){
        throw new Error(`Mangled RGBA color: ${RGBAtuple}`);
    }
    return new Uint8ClampedArray([RGBAtuple[0], RGBAtuple[1], RGBAtuple[2], RGBAtuple[3]]);
}

// determines equality of two colors in RGBA array format
function colorsEqual(color1: RGBA, color2: RGBA): boolean {
    return (
        color1[0] === color2[0] &&
        color1[1] === color2[1] &&
        color1[2] === color2[2] &&
        color1[3] === color2[3]);
}

function floodFill(context: CanvasRenderingContext2D,
                   xCoord: number,
                   yCoord: number,
                   fillColor: RGBA,
                   backgroundColor: RGBA): void {
    const canvas = context.canvas;
    const [height, width] = [canvas.height, canvas.width];
    let iterIndex = 0;
    let fillQueue = [[xCoord, yCoord]];
    while (fillQueue.length >= 1 && iterIndex < 100) {
        let shifted = fillQueue.shift();
        if(!shifted){
            throw new Error(`Unable to fill at coordinates ${shifted}`);
        }
        let [x, y] = shifted;
        const imgData = context.getImageData(x, y, 1, 1);
        const pixelColor = imgData.data;
        if (x < 0 || y < 0 || x > width || y > height) {
            continue;
        }
        else if (colorsEqual(pixelColor, fillColor)) {
            continue;
        }
        else if (colorsEqual(pixelColor, backgroundColor)) {
            console.log(`filling pixel at ${x},${y} with ${fillColor}`);
            console.log(`imgData before: `, context.getImageData(x, y, 1, 1));
            for (let i = 0; i < pixelColor.length; i++) {
                console.log(pixelColor[i], fillColor[i]);
                pixelColor[i] = fillColor[i];
            }
            console.log(imgData.data);
            context.putImageData(imgData, x, y);
            console.log(`imgData after: `, context.getImageData(x, y, 1, 1));
            fillQueue.push([x + 1, y]);
            fillQueue.push([x, y + 1]);
            fillQueue.push([x - 1, y]);
            fillQueue.push([x, y - 1]);
        }
        iterIndex += 1;
    }
}
export class FillTool extends Tool {
    private stroke: FillStroke;
    constructor() {
        super('fill');
        this.toolName = 'fill';
        this.displayName = 'Fill';
        this.stroke = new FillStroke(this.color, new Uint8ClampedArray());
    }
    handleEvent(event: any, context: CanvasRenderingContext2D) {
        const xCoord = (Math.floor(event.clientX) - event.leftOffset) / event.scaleFactor;
        const yCoord = (Math.floor(event.clientY) - event.topOffset) / event.scaleFactor;
        if (event.type === 'mousedown') {
            const backgroundColor = context.getImageData(xCoord, yCoord, 1, 1).data;
            this.stroke.setColor(this.color);
            console.log(`filling ${backgroundColor} from ${xCoord},${yCoord} with ${this.stroke.getColor()}`);
            this.stroke.pushCoords([xCoord, yCoord]);
            this.stroke.backgroundColor = backgroundColor;
            return this.stroke;
        }
    }
}

export class FillStroke extends Stroke {
    public backgroundColor: RGBA;
    constructor(fillColor: string, bgColor: RGBA) {
        super('fill', fillColor);
        this.backgroundColor = bgColor
    }
    redoStroke(context: CanvasRenderingContext2D) {
        const color = hexToRGBA(this.color);
        const backgroundColor = this.backgroundColor;
        let [xCoord, yCoord] = [this.coords[0][0], this.coords[0][1]];
        floodFill(context, xCoord, yCoord, color, backgroundColor);
    }
}
