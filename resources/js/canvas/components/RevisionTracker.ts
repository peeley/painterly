import { fabric } from 'fabric';
interface Change {
    uuid: string,
    hash: string,
    action: CreationOrDeletion | Modification
};

interface CreationOrDeletion {
    item: UUIDObject,
    type: 'creation' | 'deletion'
};

interface Modification {
    before: UUIDObject,
    after: UUIDObject
};

export interface UUIDObject extends fabric.Object {
    uuid: string
};

const CHANGE_STORAGE_MEMORY = 100;

export class RevisionTracker {

    private hash: number;
    private canvas: fabric.Canvas;

    constructor(canvas: fabric.Canvas){
        this.hash = 0;
        this.canvas = canvas;
    }

    redo = (change: Change) => {} // TODO

    undo = (change: Change) => {} // TODO

    checksumMatches = (checksum: string) => {
        // TODO check if incoming change is synchronized via checking checksum
    }
}
