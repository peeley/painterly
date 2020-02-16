

export class Brush {
    constructor(){
        this.mouseDown = false;
        this.dotSize = 10;
        this.handleEvent = this.handleEvent.bind(this);
    }
    handleEvent(event, context){
        if(event.type === "mousedown"){
            this.mouseDown = true;
            let mouseX = event.clientX;
            let mouseY = event.clientY;
            context.fillRect(mouseX, mouseY, this.dotSize, this.dotSize);
        }
        else if(event.type === "mouseup"){
            this.mouseDown = false;
        }
        else if(this.mouseDown && event.type === "mousemove"){
            let mouseX = event.clientX;
            let mouseY = event.clientY;
            context.fillRect(mouseX, mouseY, this.dotSize, this.dotSize);
        }
    }   
}

