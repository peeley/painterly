import React from 'react';
import './Canvas.css';
import { Palette } from './Palette.js';
import { ToolController } from './ToolController.js';

class Canvas extends React.Component{
    constructor(props){
        super(props);
        this.drawSurfaceRef = React.createRef();
        this.updateToolColor = this.updateToolColor.bind(this);
        this.updateStrokeWidth = this.updateStrokeWidth.bind(this);
    }
    componentDidMount(){
        this.drawSurfaceCtx = this.drawSurfaceRef.current.getContext('2d');
        this.toolController = new ToolController(this.drawSurfaceRef);
    }
    updateToolColor(color){
        this.toolController.setColor(color);
    }
    updateStrokeWidth(width){
        this.toolController.setStrokeWidth(width);
    }
    render(){
        return(
            <div className="Canvas">
                <Palette 
                    TooleColor={this.updateToolColor} 
                    updateStrokeWidth={this.updateStrokeWidth}
                    updateColor={this.updateToolColor}
                />
                <canvas id="drawSurface" 
                    onMouseDown = {(event) => 
                        this.toolController.handleEvent(event, 
                            this.drawSurfaceCtx)}
                    onMouseMove = {(event) => 
                        this.toolController.handleEvent(event, 
                            this.drawSurfaceCtx)}
                    onMouseLeave = {(event) => 
                        this.toolController.handleEvent(event, 
                            this.drawSurfaceCtx)}
                    onMouseUp = {(event) => 
                        this.toolController.handleEvent(event, 
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
