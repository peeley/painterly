import React from 'react';
import './Canvas.css';
import { ToolController } from './ToolController.js';

class Canvas extends React.Component{
    constructor(props){
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.handleToolSelect = this.handleToolSelect.bind(this);
        this.state = {
            drawSurface: React.createRef()
        };
    }
    componentDidMount(){
        document.addEventListener('keydown', (event) => {
            if(event.ctrlKey && event.key === 'z'){
                // TODO : create undo method, clean up keypress listener
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
    render(){
        return(
            <div className="Canvas">
                <ToolController 
                    surface={this.state.drawSurface}
                    handleToolSelect={this.handleToolSelect}
                />
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
