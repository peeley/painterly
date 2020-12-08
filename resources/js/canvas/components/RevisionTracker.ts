import { fabric } from 'fabric';

interface Change {
    hash: string,
    action: Creation | Deletion | Modification
}

interface Creation {
    item: UUIDObject
}

interface Deletion {
    item: UUIDObject
}

interface Modification {
    before: UUIDObject,
    after: UUIDObject
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
        this.changes.push({
            hash: this.hash,
            action: {
                item: created,
            } as Creation
        });
        if(this.changes.length > CHANGE_STORAGE_MEMORY){
            this.changes.shift();
        }
        this.setHash();
    }

    registerModification = (before: UUIDObject, after: UUIDObject) => {
        this.changes.push({
            hash: this.hash,
            action: {
                before,
                after
            }
        });
        if(this.changes.length > CHANGE_STORAGE_MEMORY){
            this.changes.shift();
        }
        this.setHash();
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
        this.performUndoAction(change.action);
    }

    performUndoAction = (action: any /* Action */) => {
        // dispatch on action type
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
        this.performRedoAction(change.action);
    }

    performRedoAction = (action: any /* Action */) => {
        // dispatch on action type
    }

    applyRevision = (change: Change) => {
        // TODO
    }

}
