import { fabric } from 'fabric';

export type UpdateAction = "modify" | "add" | "remove" | "clear";

export interface OutgoingEvent {
    action: UpdateAction,
    objects?: UUIDObject | UUIDObject[]
}

interface Change {
    item: UUIDObject,
    performUndo(canvas: fabric.Canvas): void,
    performRedo(canvas: fabric.Canvas): void,
    getEvent(revisionType: RevisionType): OutgoingEvent,
}

type RevisionType = "undo" | "redo";

class Creation implements Change {
    public item: UUIDObject;
    constructor(item: UUIDObject){
        this.item = item;
    }
    performUndo(canvas: fabric.Canvas){
        canvas.remove(this.item);
    }
    performRedo(canvas: fabric.Canvas){
        canvas.add(this.item);
    }
    getEvent(revisionType: RevisionType): OutgoingEvent{
        return {
            action: revisionType === 'undo' ? "remove" : "add",
            objects: [this.item.toObject(['uuid'])]
        }
    }
}

class Deletion implements Change {
    public item: UUIDObject;
    constructor(item: UUIDObject){
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
    getEvent(revisionType: RevisionType): OutgoingEvent{
        return {
            action: revisionType === 'undo' ? "add" : "remove",
            objects: [this.item.toObject(['uuid'])]
        }
    }
}

export interface Transformation {
    angle: number,
    left: number,
    top: number,
    scaleX: number,
    scaleY: number,
    text: string // special case for changing text in IText
}

class Modification implements Change {
    public item: UUIDObject;
    private before: Transformation;
    private after: Transformation;
    constructor(item: UUIDObject, before: Transformation, after: Transformation){
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
    getEvent(revisionType: RevisionType): OutgoingEvent{
        return {
            action: "modify",
            objects: this.item
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

    registerCreation = (created: UUIDObject) => {
        this.changes.push(new Creation(created));
        if(this.changes.length > CHANGE_STORAGE_MEMORY){
            this.changes.shift();
        }
    }

    registerDeletion = (deleted: UUIDObject) => {
        this.changes.push(new Deletion(deleted));
        if(this.changes.length > CHANGE_STORAGE_MEMORY){
            this.changes.shift();
        }
    }

    registerModification = (item: UUIDObject, before: Transformation, after: Transformation) => {
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

    undosAvailable = (): boolean => {
        return this.changes.length > 0;
    }

    redosAvailable = (): boolean => {
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
