export class Brush {
    constructor(){
        this.mouseDown = false;
        this.dotSize = 1;
        this.color = "#42445A";
        this.handleEvent = this.handleEvent.bind(this);
        this.setColor = this.setColor.bind(this);
        this.getColor = this.getColor.bind(this);
        this.getStrokeWidth = this.getStrokeWidth.bind(this);
        this.setStrokeWidth = this.setStrokeWidth.bind(this);
        this.joinType = 'round';
        this.lineVertices = [];
    }
    setColor(color){
        this.color = color;
    }
    getColor(){
        return this.color;
    }
    setStrokeWidth(width){
        this.dotSize = width;
    }
    getStrokeWidth(){
        return this.dotSize;
    }
    handleEvent(event, context){
        if(event.type === "mousedown"){
            this.mouseDown = true;
            context.beginPath();
            context.moveTo(event.clientX, event.clientY);
        }
        else if(event.type === "wheel"){
            if(event.deltaY > 0 && this.dotSize > 1){
                this.dotSize -= 1; 
            }
            else if(event.deltaY < 0 && this.dotSize < 30){
                this.dotSize += 1;
            }
        }
        else if(event.type === "mouseup" || event.type === "mouseleave"){
            this.mouseDown = false;
        }
        else if(this.mouseDown && event.type === "mousemove"){
            console.log(this.color);
            context.lineWidth = this.dotSize;
            context.lineJoin = this.joinType;
            context.strokeStyle = this.color;
            context.lineTo(event.clientX, event.clientY);
            context.stroke();
        }
    }   
}

