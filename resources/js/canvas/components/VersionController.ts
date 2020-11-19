import axios from 'axios';
import { fabric } from 'fabric';
import { v4 } from 'uuid'
import Echo from 'laravel-echo';

interface UUIDObject extends fabric.Object {
    uuid: string
}

type UpdateAction = "modify" | "add" | "remove" | "clear" | "undo" | "redo";

interface OutgoingEvent {
    action: UpdateAction,
    objects?: UUIDObject
}

interface PaintingUpdateEvent {
    paintingId: number,
    action: UpdateAction | null,
    objects: UUIDObject | null
    title: string | null
}

export class VersionController {
    private paintingId: number;
    private versionHistory: Array<fabric.Object> = [];
    private drawSurface: fabric.Canvas;
    private currentVersion: number = 0;
    private syncingCallback: (_: boolean) => void;

    constructor(id: number, drawSurface: fabric.Canvas, syncingCallback: (_: boolean) => void) {
        this.paintingId = id;
        this.drawSurface = drawSurface;
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
            .listen('PaintingUpdateEvent', (data: PaintingUpdateEvent) => {
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
                    case 'undo':
                        this.currentVersion -= 1;
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
    handleAddEvent = (object: UUIDObject) => {
        if (!object) {
            console.log('Received bad `add` event');
            return;
        }
        fabric.util.enlivenObjects([object], (objects: Array<UUIDObject>) => {
            objects.forEach((obj: UUIDObject) => {
                this.drawSurface.add(obj);
            });
        }, 'fabric');
        this.pushItemToHistory(object);
    }
    handleModifyEvent = (object: UUIDObject) => {
        this.drawSurface.off('object:modified', this.modify);
        this.drawSurface.forEachObject((obj: any) => {
            // TODO convert obj to type UUIDObject
            if (obj.uuid === object.uuid) {
                obj.set(object);
                return;
            }
        });
        this.drawSurface.renderAll();
        this.drawSurface.on('object:modified', this.modify);
    }
    handleRemoveEvent = (object: UUIDObject) => {
        this.drawSurface.forEachObject((obj: any) => {
            if (obj.uuid === object.uuid) {
                this.drawSurface.remove(obj);
                return;
            }
        })
    }
    pushItemToHistory = (_item: fabric.Object) => {
        if (this.currentVersion !== this.versionHistory.length) {
            this.versionHistory = this.versionHistory.slice(
                0, this.currentVersion);
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
            objects: item.toObject(['uuid']),
            action: 'add'
        }, () => {
            this.pushPreview();
        });
        this.pushItemToHistory(item);
    }
    pushPreview = () => {
        let preview = this.drawSurface.toDataURL({ format: 'png' });
        axios.post(`${process.env.MIX_APP_URL}/api/p/${this.paintingId}/preview`,
            { data: preview }).catch(error => {
                console.log(error) // TODO handle error
            });
    }
    modify = (event: any) => {
        let item = event.target;
        if (!item) {
            return;
        }
        let activeObject: any = this.drawSurface.getActiveObject();
        if(activeObject.type === 'activeSelection'){
            this.modifyGroup(activeObject);
        }
        else{
            this.modifySingle(item);
        }
    }
    modifyGroup = (group: any) => {
        console.log('handling group modify event: ', group);
        const groupChanges = {
            angle: group.angle,
            height: group.height,
            left: group.left,
            top: group.top,
            width: group.width,
        }
        const groupIds = group.getObjects().map( (item: any) => {
            return item.uuid;
        });
        console.log('group ids:', groupIds);
        const modified = this.drawSurface.getObjects().filter( (item: any) => {
            return groupIds.includes(item.uuid);
        });
        console.log('modified:', modified);
        for (let object of modified) {
            console.log('object in group modify:', object);
            //object.set(groupChanges);
            this.modifySingle(object);
        }
        return;
    }
    modifySingle = (item: any) => {
        console.log('sending single modification to backend: ', item);
        this.sendEvent({
            objects: item.toObject(['uuid']),
            action: 'modify',
        }, () => {
            this.pushPreview();
        });
    }
    remove = (event: any) => {
        const removed = event.target;
        if (!removed) {
            return;
        }
        console.log('sending deleted object to backend: ', removed.toJSON(['uuid']));
        this.sendEvent({
            objects: removed.toObject(['uuid']),
            action: 'remove',
        }, () => { });
    }
    undo = () => {
        if (this.currentVersion > 0) {
            this.sendEvent({ action: 'undo' }, () => {
                this.currentVersion -= 1;
            });
        }
    }
    redo = () => {
        // TODO call PUT endpoint, figure out how to implement redo
        if (this.currentVersion < this.versionHistory.length) {
            this.currentVersion += 1;
        }
    }
    wipeHistory = () => {
        this.sendEvent({ action: 'clear' }, () => {
            // TODO handle bad response?
        });
        this.versionHistory = [];
        this.currentVersion = 0;
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
    }
}
