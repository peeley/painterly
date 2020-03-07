import { Tool } from './Tool.js';

export class RectTool extends Tool {
    constructor(surfaceRef){
        super(surfaceRef);
    }
    handleEvent(event, context){
        console.log('rect event!');
    }
}
