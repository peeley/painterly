import React from 'react';
import './Canvas.css';
import { ToolController } from './ToolController.js';
import { VersionController } from './VersionController.js';

class Canvas extends React.Component{
    constructor(props){
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.handleToolSelect = this.handleToolSelect.bind(this);
        this.versionController = new VersionController();
        this.state = {
            tool: null,
            drawSurface: React.createRef(),
        };
    }
    componentDidMount(){
        document.addEventListener('keydown', (event) => {
            if(event.ctrlKey && event.key === 'z'){
                this.versionController.undo(this.state.drawSurface);
            }
            if(event.ctrlKey && event.key === 'y'){
                this.versionController.redo(this.state.drawSurface);
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
            this.versionController.push(newItem);
            console.log(`${JSON.stringify(this.versionController.versionHistory)}`);
        }
        event.preventDefault();
    }
    render(){
        return(
            <div className="Canvas">
                <ToolController 
                    surface={this.state.drawSurface}
                    handleToolSelect={this.handleToolSelect}
                />
                <button onClick={(event) => {
                    this.versionController.undo(this.state.drawSurface)
                }}>
                    Undo
                </button>
                <button onClick={ () => {
                    this.versionController.redo(this.state.drawSurface)
                }}>Redo</button>
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
