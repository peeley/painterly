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
        this.pushCanvas = this.pushCanvas.bind(this);
        this.getCanvas = this.getCanvas.bind(this);
        this.state = {
            tool: null,
            loading: true,
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
        this.getCanvas();
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
            if(!newItem.indicator){
                this.pushCanvas();
            }
            this.clearCanvas();
            this.versionController.redrawCanvas(this.state.drawSurface);
        }
        event.preventDefault();
    }
    clearCanvas(){
        let context = this.state.drawSurface.current.getContext('2d');
        const width = context.canvas.width;
        const height = context.canvas.height;
        context.clearRect(0, 0, width, height);
    }
    pushCanvas(){
        fetch(`http://localhost:8000/api/p/${this.props.match.params.id}`, {
            method: 'POST',
            body: JSON.stringify(this.versionController.versionHistory),
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        .then( response => {
            return response.json()
        })
        .then( data => {
            console.log(data)
        });
    }
    getCanvas(){
        fetch(`http://localhost:8000/api/p/${this.props.match.params.id}`)
        .then( response => {
            return response.json()
        })
        .then( data => {
            for(const item of data){
                this.versionController.push(item);
            }
            this.versionController.redrawCanvas(this.state.drawSurface);
        });
        this.setState({
            loading: false
        });
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
                    ref={ this.state.drawSurface } />
            </div>
        )
    }
}

export default Canvas;
