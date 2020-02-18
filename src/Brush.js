export class Brush {
    constructor(){
        this.mouseDown = false;
        this.dotSize = 3;
        this.handleEvent = this.handleEvent.bind(this);
        this.lastX = null;
        this.lastY = null;
        this.joinType = 'round';
    }
    handleEvent(event, context){
        if(event.type === "mousedown"){
            this.mouseDown = true;
            this.lastX = event.clientX;
            this.lastY = event.clientY;
        }
        else if(event.type === "mouseup" || event.type === "mouseleave"){
            this.mouseDown = false;
        }
        else if(this.mouseDown && event.type === "mousemove"){
            context.linewidth = this.dotSize;
            context.lineJoin = this.joinType;
            let mouseX = event.clientX;
            let mouseY = event.clientY;
            context.beginPath();
            context.moveTo(this.lastX, this.lastY);
            context.lineTo(mouseX, mouseY);
            context.stroke();
            this.lastX = mouseX;
            this.lastY = mouseY;
        }
    }   
}

