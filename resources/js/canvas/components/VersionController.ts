import axios from 'axios';
import { fabric } from 'fabric';
import { v4 } from 'uuid'
import Echo from 'laravel-echo';
import { RevisionTracker, UUIDObject } from './RevisionTracker';
import Automerge from 'automerge';

type UpdateAction = "modify" | "add" | "remove" | "clear" | "undo" | "redo";

interface OutgoingEvent {
    action: UpdateAction,
    objects?: UUIDObject | UUIDObject[]
}

interface PaintingUpdateEvent {
    paintingId: number,
    action: UpdateAction | null,
    objects: [UUIDObject] | null
    title: string | null
}

export class VersionController {
    private paintingId: number;
    private canvas: fabric.Canvas;
    private versionTracker: Automerge.FreezeObject<{objects: any}>;
    private syncingCallback: (_: boolean) => void;

    constructor(id: number, canvas: fabric.Canvas, syncingCallback: (_: boolean) => void) {
        this.paintingId = id;
        this.canvas = canvas;
        this.versionTracker = Automerge.from({ objects: [] });
        this.syncingCallback = syncingCallback;
    }
    mountChannelListener = () => {
        let echo = new Echo({
            broadcaster: 'pusher',
            key: process.env.MIX_PUSHER_APP_KEY,
            cluster: process.env.MIX_PUSHER_APP_CLUSTER,
            forceTLS: true
        });
        echo.channel(`painting.${this.paintingId}`)
            .listen('PaintingUpdateEvent', (data: Automerge.Change[]) => {
                Automerge.applyChanges(this.versionTracker, data);
            });
    }
    push = (event: any /* event w/ UUIDObject as target */, change: Automerge.Change) => {
        //console.log('pushing event to backend: ', event);
        let item = event.target;
        if (!item) {
            return;
        }
        item.selectable = false;
        item.uuid = v4();
        this.sendEvent({
            objects: item.toObject(['uuid']),
            action: 'add'
        }, () => {
            this.pushPreview();
        });
    }
    pushPreview = () => {
        let preview = this.canvas.toDataURL({ format: 'png' });
        axios.post(`${process.env.MIX_APP_URL}/api/p/${this.paintingId}/preview`,
            { data: preview }).catch(error => {
                console.log(error) // TODO handle error
            });
    }
    modify = (event: fabric.IEvent) => {
        let item = event.target;
        if (!item) {
            return;
        }
        let activeObject: fabric.Object | fabric.Group = this.canvas.getActiveObject();
        let modified: UUIDObject[];
        if(activeObject instanceof fabric.Group){
            modified = this.applyGroupProperties(activeObject);
        }
        else{
            modified = [item.toObject(['uuid'])];
        }
        this.pushModification(modified)
    }
    // getting the properties of single objects once modified via group
    // is really difficult in fabric, as all the coords are relative to
    // the group center. the best way to get absolute coords matrix
    // transform a la:
    // https://github.com/fabricjs/fabric.js/issues/4206
    applyGroupProperties = (group: fabric.Group) => {
        let groupObjects = group.getObjects()
        return groupObjects.map( (item: any) => {
            return this.scaleItem(item, group);
        });
    }
    scaleItem = (item: fabric.Object, group: fabric.Group) => {
        const groupMatrix = group.calcTransformMatrix();
        let newPoint = fabric.util.transformPoint(
            new fabric.Point(item.left as number, item.top as number),
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
    pushModification = (item: UUIDObject[]) => {
        this.sendEvent({
            objects: item,
            action: 'modify',
        }, () => {
            this.pushPreview();
        });
    }
    // TODO seems like this shares most code w/ modify function
    remove = (event: fabric.IEvent) => {
        let active = event.target;
        if(!active){
            return;
        }
        let removed: UUIDObject[];
        if(active instanceof fabric.Group){
            removed = active.getObjects().map( (item: fabric.Object) => {
                return item.toObject(['uuid']);
            });
            let allSelected = this.canvas.getActiveObjects();
            this.canvas.remove(...allSelected);
            this.canvas.discardActiveObject().renderAll();
        }
        else{
            removed = [active.toObject(['uuid'])];
        }
        this.sendEvent({
            objects: removed,
            action: 'remove',
        }, () => { });
    }
    undo = () => {
        // TODO
    }
    redo = () => {
        // TODO call PUT endpoint, figure out how to implement redo
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
        this.canvas.loadFromJSON({ objects: history }, () => {
            this.canvas.forEachObject(obj => {
                obj.selectable = false;
            })
            this.canvas.renderAll();
        });
    }
    setDrawSurface(canvas: fabric.Canvas): void {
        this.canvas = canvas;
        this.versionTracker = Automerge.from({ objects: canvas._objects });
    }
}
