import React from 'react';
import './Canvas.css';
import { Palette } from './Palette.js';
import { BrushController } from './BrushController.js';

class Canvas extends React.Component{
    constructor(props){
        super(props);
        this.drawSurfaceRef = React.createRef();
        this.updateBrushColor = this.updateBrushColor.bind(this);
        this.updateStrokeWidth = this.updateStrokeWidth.bind(this);
    }
    componentDidMount(){
        this.drawSurfaceCtx = this.drawSurfaceRef.current.getContext('2d');
        this.brushController = new BrushController(this.drawSurfaceRef);
    }
    updateBrushColor(color){
        this.brushController.setColor(color);
    }
    updateStrokeWidth(width){
        this.brushController.setStrokeWidth(width);
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
                        this.brushController.handleEvent(event, 
                            this.drawSurfaceCtx)}
                    onMouseMove = {(event) => 
                        this.brushController.handleEvent(event, 
                            this.drawSurfaceCtx)}
                    onMouseLeave = {(event) => 
                        this.brushController.handleEvent(event, 
                            this.drawSurfaceCtx)}
                    onMouseUp = {(event) => 
                        this.brushController.handleEvent(event, 
                            this.drawSurfaceCtx)}
                    height = { window.innerHeight * .9 }
                    width = { window.innerWidth * .9 }
                    ref={ this.drawSurfaceRef }
                />
            </div>
        )
    }
}

export default Canvas;
