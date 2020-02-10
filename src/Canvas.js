import React from 'react';
import './Canvas.css';

class Canvas extends React.Component{
    constructor(props){
        super(props);
        this.drawSurfaceRef = React.createRef();
        this.drawDot = this.drawDot.bind(this);
    }
    componentDidMount(){
        this.drawSurfaceCtx = this.drawSurfaceRef.current.getContext('2d');
        this.drawSurfaceCtx.fillStyle = 'black';
    }
    render(){
        return(
            <div className="Canvas">
                <canvas id="drawSurface" 
                    height = { window.innerHeight * .9 }
                    width = { window.innerWidth * .9 }
                    ref={ this.drawSurfaceRef } 
                    onClick={ this.drawDot }
                />
            </div>
        )
    }
    drawDot(event){
        event.preventDefault();
        let mouseX = event.clientX;
        let mouseY = event.clientY;
        this.drawSurfaceCtx.fillRect(mouseX, mouseY, 10, 10);
    }
}

export default Canvas;
