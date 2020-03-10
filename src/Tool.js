
export class Tool {
    constructor(){
        this.mouseDown = false;
        this.color = "#42445A";
        this.setColor = this.setColor.bind(this);
        this.getColor = this.getColor.bind(this);
    }
    setOffsets(drawSurface){
        let rect = drawSurface.current.getBoundingClientRect();
        this.topOffset = rect.top;
        this.leftOffset = rect.left;
    }
    setColor(color){
        this.color = color;
    }
    getColor(){
        return this.color;
    }
    handleEvent(event, context){}
}
