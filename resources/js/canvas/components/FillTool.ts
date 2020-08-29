import { Tool } from './Tool';
import Stroke from './Stroke';

type RGBA = Uint8ClampedArray;

// converts hexadecimal string to RGBA array
let hexToRGBA = (color: string): RGBA => {
    let RGBAstr = color.split('(')[1].split(')')[0].split(',');
    let RGBAtuple = RGBAstr.map(item => +item); // + is unary operator for numeric cast
    if (RGBAtuple.length !== 4) {
        throw new Error(`Mangled RGBA color: ${RGBAtuple}`);
    }
    return new Uint8ClampedArray([RGBAtuple[0], RGBAtuple[1], RGBAtuple[2], RGBAtuple[3]]);
}

let RGBAtoHex = (color: RGBA): string => {
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;
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
    const imgData: ImageData = context.getImageData(0, 0, width, height);
    let fillQueue = [[xCoord, yCoord]];
    let idx = 0;
    while (fillQueue.length >= 1 && idx < 1000) {
        let shifted = fillQueue.shift();
        if (!shifted) {
            throw new Error(`Unable to fill at coordinates ${shifted}`);
        }
        let [x, y] = shifted;
        const pixelColor: RGBA = imgData.data.slice((y * width + x) * 4, ((y * width + x) * 4) + 4);
        if (x < 0 || y < 0 || x > width || y > height) {
            continue;
        }
        else if (colorsEqual(pixelColor, fillColor)) {
            continue;
        }
        else if (colorsEqual(pixelColor, backgroundColor)) {
            for (let i = (y*width + x)*4; i < ((y*width + x)*4) + 4; i++) {
                imgData.data[i] = fillColor[i - (y*width + x)*4];
            }
            fillQueue.push([x + 1, y]);
            fillQueue.push([x, y + 1]);
            fillQueue.push([x - 1, y]);
            fillQueue.push([x, y - 1]);
        }
        idx += 1;
    }
    context.putImageData(imgData, 0, 0);
}
export class FillTool extends Tool {
    private stroke: FillStroke;
    constructor() {
        super('fill');
        this.toolName = 'fill';
        this.displayName = 'Fill';
        this.stroke = new FillStroke(this.color, new Uint8ClampedArray(4));
    }
    handleEvent(event: any, context: CanvasRenderingContext2D) {
        const xCoord = Math.floor((event.clientX - event.leftOffset) / event.scaleFactor);
        const yCoord = Math.floor((event.clientY - event.topOffset) / event.scaleFactor);
        if (event.type === 'mousedown') {
            const backgroundColor = context.getImageData(xCoord, yCoord, 1, 1).data;
            this.stroke.setColor(this.color);
            console.log(`filling ${backgroundColor} from ${xCoord},${yCoord} with ${this.stroke.getColor()}`);
            this.stroke.pushCoords([xCoord, yCoord]);
            this.stroke.backgroundColor = backgroundColor;
            let finishedStroke = this.stroke;
            this.stroke = new FillStroke(this.color, new Uint8ClampedArray(4));
            return finishedStroke;
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
        let [xCoord, yCoord] = [this.coords[0][0], this.coords[0][1]];
        floodFill(context, xCoord, yCoord, color, this.backgroundColor);
    }
    serialize = () => {
        return {
            type: this.type,
            color: this.color,
            backgroundColor: this.backgroundColor,
            coords: this.coords,
        };
    }
    deserialize = (json: any) => {
        this.type = json.type;
        this.color = json.color;
        this.backgroundColor = json.backgroundColor;
        this.coords = json.coords;
    }
}
