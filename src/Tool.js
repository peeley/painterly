
export class Tool {
    constructor(drawSurfaceRef){
        let rect = drawSurfaceRef.current.getBoundingClientRect();
        this.topOffset = rect.top;
        this.leftOffset = rect.left;
        this.mouseDown = false;
        this.color = "#42445A";
        this.setColor = this.setColor.bind(this);
        this.getColor = this.getColor.bind(this);
    }
    setColor(color){
        this.color = color;
    }
    getColor(){
        return this.color;
    }
    handleEvent(event, context){}
}
