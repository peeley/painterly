import { Tool } from './Tool';
import { fabric } from 'fabric';

export class SelectorTool extends Tool {
    constructor(){
        super('selector');
        this.toolName = 'selector';
        this.displayName = 'Selector';
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
    handleEvent = (_type: string, _event: any, _canvas: fabric.Canvas) => {}
}
