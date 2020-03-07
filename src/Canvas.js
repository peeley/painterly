import React from 'react';
import './Canvas.css';
import { Palette } from './Palette.js';
import { ToolController } from './ToolController.js';
import { ToolList } from './ToolList.js';

class Canvas extends React.Component{
    constructor(props){
        super(props);
        this.drawSurfaceRef = React.createRef();
        this.updateToolColor = this.updateToolColor.bind(this);
        this.updateStrokeWidth = this.updateStrokeWidth.bind(this);
        this.state = {
            toolController: { selectNewTool: () => {console.log('fjs')}}
        };
    }
    componentDidMount(){
        this.drawSurfaceCtx = this.drawSurfaceRef.current.getContext('2d');
        this.setState({
            toolController: new ToolController(this.drawSurfaceRef)
        });
    }
    updateToolColor(color){
        this.state.toolController.setColor(color);
    }
    updateStrokeWidth(width){
        this.state.toolController.setStrokeWidth(width);
    }
    render(){
        return(
            <div className="Canvas">
                <Palette 
                    updateStrokeWidth={this.updateStrokeWidth}
                    updateColor={this.updateToolColor}
                />
                <ToolList selectTool={this.state.toolController.selectNewTool}/>
                <canvas id="drawSurface" 
                    onMouseDown = {(event) => 
                        this.state.toolController.handleEvent(event, 
                            this.drawSurfaceCtx)}
                    onMouseMove = {(event) => 
                        this.state.toolController.handleEvent(event, 
                            this.drawSurfaceCtx)}
                    onMouseLeave = {(event) => 
                        this.state.toolController.handleEvent(event, 
                            this.drawSurfaceCtx)}
                    onMouseUp = {(event) => 
                        this.state.toolController.handleEvent(event, 
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
