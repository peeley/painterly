import axios from 'axios';
import { fabric } from 'fabric';
import { v4 } from 'uuid'
import Echo from 'laravel-echo';
import { RevisionTracker, UUIDObject, Transformation, OutgoingEvent, UpdateAction } from './RevisionTracker';

interface PaintingUpdateEvent {
    paintingId: number,
    action: UpdateAction | null,
    objects: [UUIDObject] | null
    title: string | null
}

export class EventHandler {
    private paintingId: number;
    private drawSurface: fabric.Canvas;
    private syncingCallback: (_: boolean) => void;
    private revisionTracker: RevisionTracker;
    constructor(id: number, drawSurface: fabric.Canvas, syncingCallback: (_: boolean) => void) {
        this.paintingId = id;
        this.drawSurface = drawSurface;
        this.syncingCallback = syncingCallback;
        this.revisionTracker = new RevisionTracker(this.drawSurface);
    }
    mountChannelListener = () => {
        let echo = new Echo({
            broadcaster: 'pusher',
            key: process.env.MIX_PUSHER_APP_KEY,
            wsHost: window.location.hostname,
            wsPort: 6001,
            forceTLS: false,
            disableStats: false
        });
        echo.channel(`painting.${this.paintingId}`)
            .listen('PaintingUpdateEvent', (data: PaintingUpdateEvent) => {
                console.log(data);
                switch (data.action) {
                    case 'add':
                        if (!data.objects) {
                            throw Error('Missing object on `add` event.');
                        }
                        this.handleAddEvent(data.objects);
                        break;
                    case 'modify':
                        if (!data.objects) {
                            throw Error('Missing object on `modify` event.');
                        }
                        this.handleModifyEvent(data.objects);
                        break;
                    case 'clear':
                        this.drawSurface.clear();
                        break;
                    case 'remove':
                        if (!data.objects) {
                            throw Error('Missing object on `remove` event.');
                        }
                        this.handleRemoveEvent(data.objects);
                        break;
                    default:
                        throw Error(`Unsupported update type: ${data.action}`);
                }
            });
    }
    handleAddEvent = (objects: UUIDObject[]) => {
        if (!objects) {
            console.log('Received bad `add` event');
            return;
        }
        console.log('received add event: ', objects);
        fabric.util.enlivenObjects(objects, (objects: Array<UUIDObject>) => {
            objects.forEach((obj: UUIDObject) => {
                console.log('enlivened: ', obj);
                this.drawSurface.add(obj);
            });
        }, 'fabric');
    }
    handleModifyEvent = (objects: [UUIDObject]) => {
        this.drawSurface.off('object:modified', this.modify);
        // TODO reduce n^2 complexity
        for(let modified of objects){
            this.drawSurface.forEachObject((obj: any) => {
                // TODO convert obj to type UUIDObject
                if (obj.uuid === modified.uuid) {
                    obj.set(modified);
                    return;
                }
            });
        }
        this.drawSurface.renderAll();
        this.drawSurface.on('object:modified', this.modify);
    }
    handleRemoveEvent = (objects: [UUIDObject]) => {
        for(let object of objects){
            this.drawSurface.forEachObject((obj: any) => {
                if (obj.uuid === object.uuid) {
                    this.drawSurface.remove(obj);
                    return;
                }
            });
        }
    }
    push = (event: any /* event w/ UUIDObject as target */) => {
        //console.log('pushing event to backend: ', event);
        let item = event.target;
        if (!item) {
            return;
        }
        item.selectable = false;
        item.uuid = v4();
        this.sendEvent({
            objects: [item.toObject(['uuid'])],
            action: 'add'
        }, () => {
            //this.pushPreview();
        });
        this.revisionTracker.registerCreation(item);
    }
    pushPreview = () => {
        let preview = this.drawSurface.toDataURL({ format: 'png' });
        axios.post(`${process.env.MIX_APP_URL}/api/p/${this.paintingId}/preview`,
            { data: preview }).catch(error => {
                console.log(error) // TODO handle error
            });
    }
    modify = (event: fabric.IEvent) => {
        console.log('canvas recieved modify event');
        let item = event.target;
        if (!item) {
            return;
        }
        let activeObject: fabric.Object | fabric.Group = this.drawSurface.getActiveObject();
        let modified: UUIDObject[];
        if(activeObject instanceof fabric.Group){
             modified = this.applyGroupProperties(activeObject);
        }
        else{
            modified = [item.toObject(['uuid'])];
        }
        this.revisionTracker.registerModification(
            activeObject as UUIDObject,
            this.getTransformation(event.transform?.original),
            this.getTransformation(event.target)
        );
        this.pushModification(modified)
    }
    // getting the properties of single objects once modified via group
    // is really difficult in fabric, as all the coords are relative to
    // the group center. the best way to get absolute coords matrix
    // transform a la:
    // https://github.com/fabricjs/fabric.js/issues/4206
    applyGroupProperties = (group: fabric.Group): UUIDObject[] => {
        let groupObjects = group.getObjects()
        let updatedGroup = groupObjects.map( (item: any) => {
            let updatedItem = this.itemCoordsFromGroup(item, group);
            return updatedItem;
        });
        return updatedGroup;
    }
    itemCoordsFromGroup = (item: fabric.Object, group: fabric.Group): UUIDObject => {
        const groupMatrix = item.calcTransformMatrix();
        let newPoint = fabric.util.transformPoint(
            new fabric.Point(-(item.width as number)/2, -(item.height as number)/2),
            groupMatrix);
        let itemObject = item.toObject(['uuid']);
        itemObject['top'] = newPoint.y;
        itemObject['left'] = newPoint.x;
        if(group.angle){
            itemObject['angle'] = itemObject.angle + group.angle;
        }
        if(group.scaleX){
            itemObject['scaleX'] = itemObject.scaleX * group.scaleX;
        }
        if(group.scaleY){
            itemObject['scaleY'] = itemObject.scaleY * group.scaleY;
        }
        return itemObject;
    }
    getTransformation = (item: any): Transformation => {
        return {
            angle: item.angle,
            left: item.left,
            top: item.top,
            scaleX: item.scaleX,
            scaleY: item.scaleY,
        }
    }
    pushModification = (item: UUIDObject[]) => {
        this.sendEvent({
            objects: item,
            action: 'modify',
        }, () => {
            //this.pushPreview();
        });
    }
    // TODO seems like this shares most code w/ modify function
    remove = (event: fabric.IEvent) => {
        let active: any /* UUIDObject */ = event.target;
        if(!active){
            return;
        }
        let removed: UUIDObject[];
        if(active instanceof fabric.Group){
            removed = active.getObjects().map( (item: any) => {
                this.revisionTracker.registerDeletion(item as UUIDObject);
                return item.toObject(['uuid']);
            });
            let allSelected = this.drawSurface.getActiveObjects();
            this.drawSurface.remove(...allSelected);
            this.drawSurface.discardActiveObject().renderAll();
        }
        else{
            this.revisionTracker.registerDeletion(active as UUIDObject);
            removed = [active.toObject(['uuid'])];
        }
        this.sendEvent({
            objects: removed,
            action: 'remove',
        }, () => { });
    }
    undo = () => {
        let event = this.revisionTracker.applyRevision('undo');
        if(event){
            // group modify, as always, is a special case
            if(event.action === "modify" && event.objects instanceof fabric.Group){
                event.objects = this.applyGroupProperties(event.objects);
            }
            this.sendEvent(event, () => {});
        }
    }
    redo = () => {
        let event = this.revisionTracker.applyRevision('redo');
        if(event){
            // group modify, as always, is a special case
            if(event.action === "modify" && event.objects instanceof fabric.Group){
                event.objects = this.applyGroupProperties(event.objects);
            }
            this.sendEvent(event, () => {});
        }
    }
    checksumMatches = (checksum: string): boolean => {
        let currentCanvasChecksum = btoa(this.drawSurface.getObjects().toString());
        return currentCanvasChecksum === checksum;
    }
    wipeHistory = () => {
        this.sendEvent({ action: 'clear' }, () => {
            // TODO handle bad response?
        });
    }
    // TODO define outgoing event type
    sendEvent = (event: OutgoingEvent, callback: Function) => {
        this.syncingCallback(true);
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
                this.syncingCallback(false);
            })
            .catch( error => {
                if(error.response && error.response.status === 419){ // login expired
                    window.location.replace(`${process.env.MIX_APP_URL}/login`);
                }
            });
    }
    // TODO create type for serialized objects
    deserializeHistory = (history: Array<UUIDObject>) => {
        console.log(`deserializing from backend: `, history);
        this.drawSurface.loadFromJSON({ objects: history }, () => {
            this.drawSurface.forEachObject(obj => {
                obj.selectable = false;
            })
            this.drawSurface.renderAll();
        });
    }
    setDrawSurface(canvas: fabric.Canvas): void {
        this.drawSurface = canvas;
        this.revisionTracker.setCanvas(canvas);
    }
}
