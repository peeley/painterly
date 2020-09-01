import { Tool } from './Tool';
import Stroke from './Stroke';

type RGBA = Uint8ClampedArray;

// converts hexadecimal string to RGBA array
let stringToTuple = (color: string): RGBA => {
    let RGBAstr = color.split('(')[1].split(')')[0].split(',');
    let RGBAtuple = RGBAstr.map(item => +item); // + is unary operator for numeric cast
    if (RGBAtuple.length !== 4) {
        throw new Error(`Mangled RGBA color: ${RGBAtuple}`);
    }
    if (RGBAtuple[3] <= 1.0) {
        RGBAtuple[3] *= 255;
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
    x: number,
    y: number,
    color: RGBA,
    backgroundColor: RGBA) {
    let pixel_stack = [{ x: x, y: y }];
    let canvas = context.canvas;
    let pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    let linear_cords = (y * canvas.width + x) * 4;
    const original_color = {
        r: backgroundColor[0],
        g: backgroundColor[1],
        b: backgroundColor[2],
        a: backgroundColor[3]
    };

    while (pixel_stack.length > 0) {
        let new_pixel = pixel_stack.shift();
        if (!new_pixel) {
            return;
        }
        x = new_pixel.x;
        y = new_pixel.y;

        //console.log( x + ", " + y ) ;

        linear_cords = (y * canvas.width + x) * 4;
        while (y-- >= 0 &&
            (pixels.data[linear_cords] == original_color.r &&
                pixels.data[linear_cords + 1] == original_color.g &&
                pixels.data[linear_cords + 2] == original_color.b &&
                pixels.data[linear_cords + 3] == original_color.a)) {
            linear_cords -= canvas.width * 4;
        }
        linear_cords += canvas.width * 4;
        y++;

        var reached_left = false;
        var reached_right = false;
        while (y++ < canvas.height &&
            (pixels.data[linear_cords] == original_color.r &&
                pixels.data[linear_cords + 1] == original_color.g &&
                pixels.data[linear_cords + 2] == original_color.b &&
                pixels.data[linear_cords + 3] == original_color.a)) {
            pixels.data[linear_cords] = color[0];
            pixels.data[linear_cords + 1] = color[1];
            pixels.data[linear_cords + 2] = color[2];
            pixels.data[linear_cords + 3] = color[3];

            if (x > 0) {
                if (pixels.data[linear_cords - 4] == original_color.r &&
                    pixels.data[linear_cords - 4 + 1] == original_color.g &&
                    pixels.data[linear_cords - 4 + 2] == original_color.b &&
                    pixels.data[linear_cords - 4 + 3] == original_color.a) {
                    if (!reached_left) {
                        pixel_stack.push({ x: x - 1, y: y });
                        reached_left = true;
                    }
                } else if (reached_left) {
                    reached_left = false;
                }
            }

            if (x < canvas.width - 1) {
                if (pixels.data[linear_cords + 4] == original_color.r &&
                    pixels.data[linear_cords + 4 + 1] == original_color.g &&
                    pixels.data[linear_cords + 4 + 2] == original_color.b &&
                    pixels.data[linear_cords + 4 + 3] == original_color.a) {
                    if (!reached_right) {
                        pixel_stack.push({ x: x + 1, y: y });
                        reached_right = true;
                    }
                } else if (reached_right) {
                    reached_right = false;
                }
            }

            linear_cords += canvas.width * 4;
        }
    }
    context.putImageData(pixels, 0, 0);
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
        const color = stringToTuple(this.color);
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
