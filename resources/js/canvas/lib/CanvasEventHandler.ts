import axios from 'axios';
import { fabric } from 'fabric';
import { v4 } from 'uuid';
import { OutgoingEvent, RevisionTracker, Transformation, UUIDObject } from './RevisionTracker';

export class CanvasEventHandler {
    private paintingId: number;
    private canvas: fabric.Canvas;
    private setSyncing: (_: boolean) => void;
    private revisionTracker: RevisionTracker;
    constructor(
        id: number,
        canvas: fabric.Canvas,
        setSyncing: (_: boolean) => void
    ){
        this.canvas = canvas;
        this.paintingId = id;
        this.revisionTracker = new RevisionTracker(this.canvas);
        this.setSyncing = setSyncing;
    }

    // TODO write/modify function for changing text items
    handleLocalModifyEvent = (event: fabric.IEvent) => {
        let item = event.target;
        if (!item) {
            return;
        }
        let modified: UUIDObject[];
        let beforeModify = this.getTransformation(event.transform?.original);
        let afterModify = this.getTransformation(event.target);
        if(!afterModify || !beforeModify){
            return;
        }
        if(item instanceof fabric.ActiveSelection){
            modified = this.groupToObjects(item, afterModify);
        }
        else{
            modified = [item.toObject(['uuid'])];
        }
        console.log(item);
        if( item.type === 'i-text' && !event.transform){ // if object is fabric.IText
            this.revisionTracker.storeObjectModification(
                item as UUIDObject,
                this.getTextTransformation(event.target, 'before'),
                this.getTextTransformation(event.target, 'after')
            );
        }
        else{
            this.revisionTracker.storeObjectModification(
                item as UUIDObject,
                beforeModify,
                afterModify
            );
        }
        this.sendEvent({
            objects: modified,
            action: 'modify',
        }, () => {
            this.pushPreview();
        });
    }
    handleLocalAddEvent = (event: any /* event w/ UUIDObject as target */) => {
        //console.log('pushing event to backend: ', event);
        let items: UUIDObject[] = event.target;
        if (!items) {
            return;
        }
        for(let item of items){
            item.selectable = false;
            item.lockScalingFlip = true;
            item.uuid = v4();
        }
        this.sendEvent({
            objects: items.map(obj => obj.toObject(['uuid'])),
            action: 'add'
        }, () => {
            this.pushPreview();
        });
        this.revisionTracker.storeObjectCreation(items);
    }
    handleLocalRemoveEvent = (event: fabric.IEvent) => {
        let active: any /* UUIDObject */ = event.target;
        if(!active){
            return;
        }
        let removed: UUIDObject[];
        if(active instanceof fabric.Group){
            this.revisionTracker.storeObjectDeletion(active.getObjects() as UUIDObject[]);
            removed = active.getObjects().map( (item: any) => {
                return item.toObject(['uuid']);
            });
            let allSelected = this.canvas.getActiveObjects();
            this.canvas.remove(...allSelected);
            this.canvas.discardActiveObject().renderAll();
        }
        else{
            this.revisionTracker.storeObjectDeletion([active]);
            removed = [active.toObject(['uuid'])];
        }
        this.sendEvent({
            objects: removed,
            action: 'remove',
        }, () => { });
    }
    // TODO make undo/redo store serialized UUIDObject instead of handling edge
    // cases here
    handleUndo = () => {
        let event = this.revisionTracker.applyRevision('undo');
        if(event && event.objects){
            // need to handle group/individual modifications differently
            if(event.action === "modify"){
                if(event.objects instanceof fabric.Group){
                    let undoTransform = this.getTransformation(event.objects);
                    event.objects = this.groupToObjects(event.objects, undoTransform);
                }
                else{
                    event.objects = [(event.objects as UUIDObject).toObject(['uuid'])];
                }
            }
            this.sendEvent(event, () => {});
        }
    }
    handleRedo = () => {
        let event = this.revisionTracker.applyRevision('redo');
        if(event){
            // group modify, as always, is a special case
            if(event.action === "modify"){
                if(event.objects instanceof fabric.Group){
                    let redoTransform = this.getTransformation(event.objects);
                    event.objects = this.groupToObjects(event.objects, redoTransform);
                }
                else{
                    event.objects = [(event.objects as UUIDObject).toObject(['uuid'])];
                }
            }
            this.sendEvent(event, () => {});
        }
    }
    canUndo = () => {
        return this.revisionTracker.isUndoAvailable();
    }
    canRedo = () => {
        return this.revisionTracker.isRedoAvailable();
    }
    sendEvent = (event: OutgoingEvent, callback: Function) => {
        this.setSyncing(true);
        axios.put(`${process.env.MIX_APP_URL}/api/p/${this.paintingId}`,
            { action: event.action, objects: JSON.stringify(event.objects) },
            { headers: { 'Content-Type': 'application/json' } })
            .then(response => {
                if (response.status === 200) {
                    callback();
                }
                else if (response.status === 401) { // not logged in
                    window.location.replace(`${process.env.MIX_APP_URL}/login`);
                }
                else if (response.status === 403) { // not authorized
                    alert('You do not have permissions to edit this item.');
                }
                this.setSyncing(false);
            })
            .catch( error => {
                if(error.response && error.response.status === 419){ // login expired
                    window.location.replace(`${process.env.MIX_APP_URL}/login`);
                }
            });
    }
    wipeHistory = () => {
        this.sendEvent({ action: 'clear' }, () => {
            // TODO handle bad response?
        });
    }
    pushPreview = () => {
        let preview = this.canvas.toDataURL({ format: 'png' });
        axios.post(`${process.env.MIX_APP_URL}/api/p/${this.paintingId}/preview`,
            { data: preview }).catch(error => {
                console.log(error) // TODO handle error
            });
    }
    // getting the properties of single objects once modified via group
    // is really difficult in fabric, as all the coords are relative to
    // the group center. the best way to get absolute coords matrix
    // transform a la:
    // https://github.com/fabricjs/fabric.js/issues/4206
    groupToObjects = (group: fabric.Group, groupState: Transformation): UUIDObject[] => {
        let groupObjects = group.getObjects()
        let updatedGroup = groupObjects.map( (item: any) =>
            this.itemCoordsFromGroup(item, groupState)
        );
        return updatedGroup;
    }
    itemCoordsFromGroup = (item: UUIDObject,
                           groupState: Transformation): UUIDObject => {
        const itemMatrix = item.calcTransformMatrix();
        let newPoint = fabric.util.transformPoint(
            new fabric.Point(-(item.width as number)/2, -(item.height as number)/2),
            itemMatrix);
        let itemObject = item.toObject(['uuid']);
        itemObject['top'] = newPoint.y;
        itemObject['left'] = newPoint.x;
        itemObject['flipX'] = groupState.flipX;
        itemObject['flipY'] = groupState.flipY;
        if(groupState.angle){
            itemObject['angle'] = itemObject.angle + groupState.angle;
        }
        if(groupState.scaleX){
            itemObject['scaleX'] = itemObject.scaleX * groupState.scaleX;
        }
        if(groupState.scaleY){
            itemObject['scaleY'] = itemObject.scaleY * groupState.scaleY;
        }
        return itemObject;
    }
    getTransformation = (item: any): Transformation => {
        console.log('getting transformation from', item);
        return {
            angle: item.angle ?? 0,
            left: item.left,
            top: item.top,
            scaleX: item.scaleX ?? 1,
            scaleY: item.scaleY ?? 1,
            skewX: item.skewX,
            skewY: item.skewY,
            flipX: item.flipX ?? false,
            flipY: item.flipY ?? false
        }
    }
    getTextTransformation = (item: any, version: 'before' | 'after'): Transformation => {
        let transform = this.getTransformation(item);
        if(version === 'before'){
            // transform.text = item._textBeforeEdit;
        }
        else{
            // transform.text = item.text;
        }
        return transform;
    }
    // TODO create type for serialized objects
    deserializeHistory = (history: Array<UUIDObject>) => {
        console.log(`deserializing from backend: `, history);
        this.canvas.loadFromJSON({ objects: history }, () => {
            this.canvas.forEachObject(obj => {
                obj.selectable = false;
            })
            this.canvas.renderAll();
        });
    }
    setCanvas(canvas: fabric.Canvas): void {
        this.canvas = canvas;
        this.revisionTracker.setCanvas(canvas);
    }
}
