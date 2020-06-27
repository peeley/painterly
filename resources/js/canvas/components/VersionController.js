export class VersionController {
    constructor(){
        this.versionHistory = [];
        this.currentVersion = 0;
    }
    push(item){
        if(this.currentVersion !== this.versionHistory.length){
            this.versionHistory = this.versionHistory.slice(
                                    0, this.currentVersion);
        }
        this.versionHistory.push(item);
        this.currentVersion += 1;
    }
    undo = (drawSurface) => {
        if(this.currentVersion > 0){
            this.currentVersion -= 1;
            this.redrawCanvas(drawSurface);
        }
    }
    redo = (drawSurface) => {
        if(this.currentVersion < this.versionHistory.length){
            this.currentVersion += 1;
            this.redrawCanvas(drawSurface);
        }
    }
    wipeHistory = () => {
        this.versionHistory = [];
        this.currentVersion = 0;
    }
    redrawCanvas = (drawSurface) => {
        let context = drawSurface.current.getContext('2d');
        let versionCounter = 1;
        const width = context.canvas.width;
        const height = context.canvas.height;
        context.clearRect(0, 0, width, height);
        while(versionCounter <= this.currentVersion){
            let stroke = this.versionHistory[versionCounter-1];
            stroke.redoStroke(context);
            if(stroke.indicator){
                this.versionHistory.splice(versionCounter-1, 1);
                this.currentVersion -= 1;
            }
            else{
                versionCounter += 1;
            }
        }
    }
}
