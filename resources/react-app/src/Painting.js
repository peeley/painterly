import React from 'react';
import './Painting.css';
import { Brush } from './Brush.js';
import { Canvas } from './Canvas.js';

class Painting extends React.Component{
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
            <div
                onMouseDown = {(event) => 
                    this.brush.handleEvent(event, this.drawSurfaceCtx)}
                onMouseMove = {(event) => 
                    this.brush.handleEvent(event, this.drawSurfaceCtx)}
                onMouseLeave = {(event) => 
                    this.brush.handleEvent(event, this.drawSurfaceCtx)}
                onMouseUp = {(event) => 
                    this.brush.handleEvent(event, this.drawSurfaceCtx)}
                onWheel = {(event) =>
                    this.brush.handleEvent(event, this.drawSurfaceCtx)}
            >
                <Canvas surfaceRef={this.drawSurfaceRef}/>
            </div>
        )
    }
}

export default Painting;
