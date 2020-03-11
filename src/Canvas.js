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
        this.state = {
            drawSurface: React.createRef()
        };
    }
    componentDidMount(){
        document.addEventListener('keydown', (event) => {
            if(event.ctrlKey && event.key === 'z'){
                this.undo();
            }
            if(event.ctrlKey && event.key === 'r'){
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
        this.state.tool.handleEvent(event, context);
        event.preventDefault();
    }
    undo(){
        console.log('undo!');
    }
    redo(){
        console.log('redo!');
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
