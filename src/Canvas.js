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
        this.clearCanvas = this.clearCanvas.bind(this);
        this.state = {
            tool: null,
            drawSurface: React.createRef(),
        };
    }
    componentDidMount(){
        document.addEventListener('keydown', (event) => {
            if(event.ctrlKey){
                switch(event.key){
                    case 'z':
                        this.versionController.undo(this.state.drawSurface);
                        break;
                    case 'y':
                        this.versionController.redo(this.state.drawSurface);
                        break;
                    default:
                }
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
            this.clearCanvas();
            this.versionController.redrawCanvas(this.state.drawSurface);
            console.log(this.versionController.versionHistory);
        }
        event.preventDefault();
    }
    clearCanvas(){
        let ctx = this.state.drawSurface.current.getContext('2d');
        this.versionController.clearCanvas(ctx);
    }
    render(){
        return(
            <div className="container col px-5 Canvas">
                <div className="row pl-5">
                    <ToolController 
                        surface={this.state.drawSurface}
                        handleToolSelect={this.handleToolSelect}
                    />
                    <div className="versionButtons pt-2 pl-5">
                        <button onClick={(event) => {
                            this.versionController.undo(this.state.drawSurface)
                        }}>
                            Undo
                        </button>
                        <button onClick={ (event) => {
                            this.versionController.redo(this.state.drawSurface)
                        }}>Redo</button>
                        <button onClick={ (event) => { 
                            this.clearCanvas();
                            this.versionController.wipeHistory()
                        }}>
                            Clear
                        </button>
                    </div>
                </div>
                <canvas className="row" id="drawSurface" 
                    onMouseDown = {this.handleInput}
                    onMouseMove = {this.handleInput}                    
                    onMouseLeave = {this.handleInput}
                    onMouseUp = {this.handleInput}
                    height = { window.innerHeight * .9 }
                    width = { window.innerWidth * .95 }
                    ref={ this.state.drawSurface }
                />
            </div>
        )
    }
}

export default Canvas;
