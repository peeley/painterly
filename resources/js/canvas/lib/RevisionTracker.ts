import { fabric } from 'fabric';

export type UpdateAction = "modify" | "add" | "remove" | "clear";

export interface OutgoingEvent {
    action: UpdateAction,
    objects?: UUIDObject | UUIDObject[]
}

interface Change {
    items: UUIDObject | UUIDObject[],
    performUndo(canvas: fabric.Canvas): void,
    performRedo(canvas: fabric.Canvas): void,
    getEvent(revisionType: RevisionType): OutgoingEvent,
}

type RevisionType = "undo" | "redo";

class Creation implements Change {
    public items: UUIDObject[];
    constructor(items: UUIDObject[]){
        this.items = items;
    }
    performUndo(canvas: fabric.Canvas){
        for(let item of this.items){
            canvas.remove(item);
        }
    }
    performRedo(canvas: fabric.Canvas){
        for(let item of this.items){
            canvas.add(item);
        }
    }
    getEvent(revisionType: RevisionType): OutgoingEvent{
        return {
            action: revisionType === 'undo' ? "remove" : "add",
            objects: this.items.map(obj => obj.toObject(['uuid']))
        }
    }
}

class Deletion implements Change {
    public items: UUIDObject[];
    constructor(items: UUIDObject[]){
        this.items = items;
    }
    performUndo(canvas: fabric.Canvas){
        for(let item of this.items){
            canvas.add(item);
        }
    }
    performRedo(canvas: fabric.Canvas){
        for(let item of this.items){
            canvas.remove(item);
        }
    }
    getEvent(revisionType: RevisionType): OutgoingEvent{
        return {
            action: revisionType === 'undo' ? "add" : "remove",
            objects: this.items.map(obj => obj.toObject(['uuid']))
        }
    }
}

export interface Transformation {
    angle: number,
    left: number,
    top: number,
    scaleX: number,
    scaleY: number,
    skewX: number,
    skewY: number,
    flipX: boolean,
    flipY: boolean
}

class Modification implements Change {
    public items: UUIDObject;
    private before: Transformation;
    private after: Transformation;
    constructor(items: UUIDObject, before: Transformation, after: Transformation){
        this.items = items;
        this.before = before;
        this.after = after;
    }
    performUndo(canvas: fabric.Canvas){
        this.changeTo(canvas, this.before);
    }
    performRedo(canvas: fabric.Canvas){
        this.changeTo(canvas, this.after);
    }
    changeTo(canvas: fabric.Canvas, changes: Transformation){
        if(this.items instanceof fabric.ActiveSelection){
            let selection: any = new fabric.ActiveSelection([], {canvas: canvas});
            canvas.setActiveObject(this.items);
            for(let obj of this.items.getObjects()){
                this.items.removeWithUpdate(obj);
                selection.addWithUpdate(obj);
                obj.setCoords();
            }
            this.items = selection
        }
        this.items.set(changes);
        this.items.setCoords();
        canvas.requestRenderAll();
        canvas.setActiveObject(this.items);
    }
    getEvent(_revisionType: RevisionType): OutgoingEvent{
        return {
            action: "modify",
            objects: this.items
        }
    }
}

export interface UUIDObject extends fabric.Object {
    uuid: string
}

const CHANGE_STORAGE_MEMORY = 100;

export class RevisionTracker {
    private changes: Change[];
    private redoStack: Change[];
    private canvas: fabric.Canvas;

    constructor(canvas: fabric.Canvas){
        this.canvas = canvas;
        this.changes = [];
        this.redoStack = [];
    }

    storeObjectCreation = (created: UUIDObject[]) => {
        this.changes.push(new Creation(created));
        if(this.changes.length > CHANGE_STORAGE_MEMORY){
            this.changes.shift();
        }
    }

    storeObjectDeletion = (deleted: UUIDObject[]) => {
        this.changes.push(new Deletion(deleted));
        if(this.changes.length > CHANGE_STORAGE_MEMORY){
            this.changes.shift();
        }
    }

    storeObjectModification = (item: UUIDObject, before: Transformation, after: Transformation) => {
        this.changes.push(new Modification(item, before, after));
        if(this.changes.length > CHANGE_STORAGE_MEMORY){
            this.changes.shift();
        }
    }

    setCanvas = (canvas: fabric.Canvas) => {
        this.canvas = canvas;
    }

    undo = (): Change | null => {
        let change = this.changes.pop();
        if(!change){
            return null; // nothing to undo
        }
        this.redoStack.push(change);
        if(this.redoStack.length > CHANGE_STORAGE_MEMORY){
            this.redoStack.shift();
        }
        change.performUndo(this.canvas);
        return change;
    }

    redo = (): Change | null => {
        let change = this.redoStack.pop();
        if(!change){
            return null; // nothing to undo
        }
        this.changes.push(change);
        if(this.changes.length > CHANGE_STORAGE_MEMORY){
            this.changes.shift();
        }
        change.performRedo(this.canvas);
        return change;
    }

    isUndoAvailable = (): boolean => {
        return this.changes.length > 0;
    }

    isRedoAvailable = (): boolean => {
        return this.redoStack.length > 0;
    }

    applyRevision = (revisionType: RevisionType): OutgoingEvent | null => {
        let change = revisionType === "undo"
            ? this.undo()
            : this.redo();
        if(!change){
            return null;
        }
        return change.getEvent(revisionType);
    }
}
