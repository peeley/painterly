import React from 'react';
import './Canvas.css';
import { Brush } from './Brush.js';

class Canvas extends React.Component{
    constructor(props){
        super(props);
        this.drawSurfaceRef = React.createRef();
        this.brush = new Brush();
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
                    onMouseDown = {(event) => this.brush.handleEvent(event, this.drawSurfaceCtx)}
                    onMouseMove = {(event) => this.brush.handleEvent(event, this.drawSurfaceCtx)}
                    onMouseLeave = {(event) => this.brush.handleEvent(event, this.drawSurfaceCtx)}
                    onMouseUp = {(event) => this.brush.handleEvent(event, this.drawSurfaceCtx)}
                />
            </div>
        )
    }
}

export default Canvas;
