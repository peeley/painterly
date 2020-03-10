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
        this.handleInput = this.handleInput.bind(this);
        this.state = {
            toolController: { selectNewTool: () => {}}
        };
    }
    componentDidMount(){
        this.drawSurfaceCtx = this.drawSurfaceRef.current.getContext('2d');
        this.setState({
            toolController: new ToolController(this.drawSurfaceRef)
        });
        document.addEventListener('keydown', (event) => {
            if(event.ctrlKey && event.key === 'z'){
                // TODO : create undo method, clean up keypress listener
            }
        });
    }
    updateToolColor(color){
        this.state.toolController.setColor(color);
    }
    updateStrokeWidth(width){
        this.state.toolController.setStrokeWidth(width);
    }
    handleInput(event){
        this.state.toolController.handleEvent(event, this.drawSurfaceCtx);
        event.preventDefault();
    }
    render(){
        return(
            <div className="Canvas">
                <div className="controlBar">
                    <Palette 
                        updateStrokeWidth={this.updateStrokeWidth}
                        updateColor={this.updateToolColor}
                    />
                    <ToolList selectTool={this.state.toolController.selectNewTool}/>
                </div>
                <canvas id="drawSurface" 
                    onMouseDown = {this.handleInput}
                    onMouseMove = {this.handleInput}                    
                    onMouseLeave = {this.handleInput}
                    onMouseUp = {this.handleInput}
                    height = { window.innerHeight * .85 }
                    width = { window.innerWidth * .9 }
                    ref={ this.drawSurfaceRef }
                />
            </div>
        )
    }
}

export default Canvas;
