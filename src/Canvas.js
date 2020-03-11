import React from 'react';
import './Canvas.css';
import { ToolController } from './ToolController.js';

class Canvas extends React.Component{
    constructor(props){
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.handleToolSelect = this.handleToolSelect.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
        this.redrawCanvas = this.redrawCanvas.bind(this);
        this.state = {
            tool: null,
            drawSurface: React.createRef(),
            versionHistory: [],
            versionPointer: 0
        };
    }
    componentDidMount(){
        document.addEventListener('keydown', (event) => {
            if(event.ctrlKey && event.key === 'z'){
                this.undo();
            }
            if(event.ctrlKey && event.key === 'y'){
                this.redo();
            }
        });
    }
    handleToolSelect(tool){
        this.setState({
            tool: tool
        });
    }
    handleInput(event){
        let context = this.state.drawSurface.current.getContext('2d');
        let newItem = this.state.tool.handleEvent(event, context);
        if(newItem != null){
            this.state.versionHistory.push(newItem);
            console.log(`versionHistory: ${JSON.stringify(this.state.versionHistory)}`);
        }
        event.preventDefault();
    }
    undo(){
        console.log('undo!');
        if(this.state.versionPointer > 0){
            this.setState({ versionPointer: this.state.versionPointer - 1});
        }
        this.redrawCanvas();
    }
    redo(){
        console.log('redo!');
        if(this.state.versionPointer < this.state.versionHistory.length - 1){
            this.setState({ versionPointer: this.state.versionPointer + 1});
        }
        this.redrawCanvas();
    }
    redrawCanvas(){
        // TODO: redraw canvas after undo/redo based on versionHistory state
    }
    render(){
        return(
            <div className="Canvas">
                <ToolController 
                    surface={this.state.drawSurface}
                    handleToolSelect={this.handleToolSelect}
                />
                <button onClick={this.undo}>Undo</button>
                <button onClick={this.redo}>Redo</button>
                <canvas id="drawSurface" 
                    onMouseDown = {this.handleInput}
                    onMouseMove = {this.handleInput}                    
                    onMouseLeave = {this.handleInput}
                    onMouseUp = {this.handleInput}
                    height = { window.innerHeight * .85 }
                    width = { window.innerWidth * .9 }
                    ref={ this.state.drawSurface }
                />
            </div>
        )
    }
}

export default Canvas;
