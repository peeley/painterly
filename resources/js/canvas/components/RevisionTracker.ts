import { fabric } from 'fabric';

interface Change {
    hash: string,
    item: UUIDObject,
    performUndo(canvas: fabric.Canvas): void,
    performRedo(canvas: fabric.Canvas): void,
}

class Creation implements Change {
    public hash: string;
    public item: UUIDObject;
    constructor(hash: string, item: UUIDObject){
        this.hash = hash;
        this.item = item;
    }
    performUndo(canvas: fabric.Canvas){
        canvas.remove(this.item);
    }
    performRedo(canvas: fabric.Canvas){
        canvas.add(this.item);
    }
}

class Deletion implements Change {
    public hash: string;
    public item: UUIDObject;
    constructor(hash: string, item: UUIDObject){
        this.hash = hash;
        this.item = item;
    }
    performUndo(canvas: fabric.Canvas){
        console.log('undoing delete of: ', this.item);
        canvas.add(this.item);
    }
    performRedo(canvas: fabric.Canvas){
        console.log('redoing delete of: ', this.item);
        canvas.remove(this.item);
    }
}

export interface Transformation {
    angle: number,
    left: number,
    top: number,
    scaleX: number,
    scaleY: number
}

class Modification implements Change {
    public hash: string;
    public item: UUIDObject;
    private before: Transformation;
    private after: Transformation;
    constructor(hash: string, item: UUIDObject, before: Transformation, after: Transformation){
        this.hash = hash;
        this.item = item;
        this.before = before;
        this.after = after;
    }
    performUndo(canvas: fabric.Canvas){
        this.item.set(this.before);
        this.item.setCoords();
        canvas.renderAll();
    }
    performRedo(canvas: fabric.Canvas){
        this.item.set(this.after);
        this.item.setCoords();
        canvas.renderAll();
    }
}

export interface UUIDObject extends fabric.Object {
    uuid: string
}

const CHANGE_STORAGE_MEMORY = 100;

export class RevisionTracker {

    private hash: string;
    private changes: Change[];
    private redoStack: Change[];
    private canvas: fabric.Canvas;

    constructor(canvas: fabric.Canvas){
        this.canvas = canvas;
        this.changes = [];
        this.redoStack = [];
        this.hash = '';
        this.setHash();
    }

    registerCreation = (created: UUIDObject) => {
        this.changes.push(new Creation(this.hash, created));
        if(this.changes.length > CHANGE_STORAGE_MEMORY){
            this.changes.shift();
        }
        this.setHash();
        //console.log(`changes: ${JSON.stringify(this.changes)} redos ${this.redoStack}`);
    }

    registerDeletion = (deleted: UUIDObject) => {
        this.changes.push(new Deletion(this.hash, deleted));
        if(this.changes.length > CHANGE_STORAGE_MEMORY){
            this.changes.shift();
        }
        this.setHash();
        //console.log(`changes: ${JSON.stringify(this.changes)} redos ${this.redoStack}`);
    }

    registerModification = (item: UUIDObject, before: Transformation, after: Transformation) => {
        this.changes.push(new Modification(this.hash, item, before, after));
        if(this.changes.length > CHANGE_STORAGE_MEMORY){
            this.changes.shift();
        }
        this.setHash();
        //console.log(`changes: ${JSON.stringify(this.changes)} redos ${JSON.stringify(this.redoStack)}`);
    }

    setHash = () => {
        this.hash = btoa(this.canvas.toJSON());
    }

    setCanvas = (canvas: fabric.Canvas) => {
        this.canvas = canvas;
    }

    undo = () => {
        let change = this.changes.pop();
        if(!change){
            return; // nothing to undo
        }
        this.redoStack.push(change);
        if(this.redoStack.length > CHANGE_STORAGE_MEMORY){
            this.redoStack.shift();
        }
        change.performUndo(this.canvas);
        //console.log(`changes: ${JSON.stringify(this.changes)} redos ${this.redoStack}`);
    }

    redo = () => {
        let change = this.redoStack.pop();
        if(!change){
            return; // nothing to undo
        }
        this.changes.push(change);
        if(this.changes.length > CHANGE_STORAGE_MEMORY){
            this.changes.shift();
        }
        change.performRedo(this.canvas);
        //console.log(`changes: ${JSON.stringify(this.changes)} redos ${this.redoStack}`);
    }

    applyRevision = (change: Change) => {
        // TODO
    }

}
