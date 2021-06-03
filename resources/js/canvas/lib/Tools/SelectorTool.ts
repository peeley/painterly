import { Tool, MouseEventType } from './Tool';
import { fabric } from 'fabric';

export class SelectorTool extends Tool {
    constructor() {
        super();
        this.displayName = 'Selector';
        this.displayIcon = 'fas fa-hand-pointer';
    }
    select = (canvas: fabric.Canvas): void => {
        canvas.selection = true;
        canvas.forEachObject(obj => {
            obj.set({ 'selectable': true });
        });
    }
    deselect = (canvas: fabric.Canvas): void => {
        canvas.selection = false;
        canvas.forEachObject(obj => {
            obj.set({ 'selectable': false });
        });
    }
    handleEvent(_type: MouseEventType, _event: any, _canvas: fabric.Canvas){ }
}
