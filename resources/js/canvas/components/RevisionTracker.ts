import { fabric } from 'fabric';
interface Change {
    hash: string,
    action: CreationOrDeletion | Modification
}

interface CreationOrDeletion {
    item: UUIDObject,
    type: 'creation' | 'deletion'
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
    private canvas: fabric.Canvas;

    constructor(canvas: fabric.Canvas){
        this.canvas = canvas;
        this.changes = [];
        this.hash = '';
        this.setHash();
    }

    registerCreation = (created: UUIDObject) => {
        this.changes.push({
            hash: this.hash,
            action: {
                item: created,
                type: 'creation',
            }
        });
        this.hash = btoa(this.changes.toString());
    }

    registerModification = (before: UUIDObject, after: UUIDObject) => {
        this.changes.push({
            hash: this.hash,
            action: {
                before,
                after
            }
        });
    }

    setHash = () => {
        this.hash = btoa(this.canvas.toJSON());
    }

    setCanvas = (canvas: fabric.Canvas) => {
        this.canvas = canvas;
    }

    redo = (change: Change) => {} // TODO

    undo = (change: Change) => {} // TODO
}
