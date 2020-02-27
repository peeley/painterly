import React from 'react';
import './Canvas.css';
import { Brush } from './Brush.js';
import { Palette } from './Palette.js';

class Canvas extends React.Component{
    constructor(props){
        super(props);
        this.drawSurfaceRef = React.createRef();
        this.updateBrushColor = this.updateBrushColor.bind(this);
        this.updateStrokeWidth = this.updateStrokeWidth.bind(this);
        this.brush = new Brush();
    }
    componentDidMount(){
        this.drawSurfaceCtx = this.drawSurfaceRef.current.getContext('2d');
        this.drawSurfaceCtx.fillStyle = 'black';
    }
    updateBrushColor(color){
        this.brush.setColor(color);
    }
    updateStrokeWidth(width){
        this.brush.setStrokeWidth(width);
    }
    render(){
        return(
            <div className="Canvas">
                <Palette 
                    updateColor={this.updateBrushColor} 
                    updateStrokeWidth={this.updateStrokeWidth}
                />
                <canvas id="drawSurface" 
                    onMouseDown = {(event) => 
                        this.brush.handleEvent(event, this.drawSurfaceCtx)}
                    onMouseMove = {(event) => 
                        this.brush.handleEvent(event, this.drawSurfaceCtx)}
                    onMouseLeave = {(event) => 
                        this.brush.handleEvent(event, this.drawSurfaceCtx)}
                    onMouseUp = {(event) => 
                        this.brush.handleEvent(event, this.drawSurfaceCtx)}
                    height = { window.innerHeight * .9 }
                    width = { window.innerWidth * .9 }
                    ref={ this.drawSurfaceRef }
                />
            </div>
        )
    }
}

export default Canvas;
