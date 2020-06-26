import React from 'react';
import axios from 'axios';
import './Canvas.css';
import { ToolController } from './ToolController.js';
import { VersionController } from './VersionController.js';
import { MenuBar } from './MenuBar.js';

class Canvas extends React.Component {
    constructor(props){
        super(props);
        this.versionController = new VersionController();
        this.state = {
            tool: null,
            title: null,
            loading: true,
            drawSurface: React.createRef(),
            scaleFactor: 1.0,
        };
        this.leftOffset = 0;
        this.topOffset = 0;
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
        this.setOffsets();
        this.getCanvas();
    }
    setOffsets = () => {
        let rect = this.state.drawSurface.current.getBoundingClientRect();
        this.leftOffset = rect.left / this.state.scaleFactor;
        this.topOffset = rect.top / this.state.scaleFactor;
    }
    handleToolSelect = (tool) => {
        this.setState({
            tool: tool
        });
    }
    handleInput = event => {
        let context = this.state.drawSurface.current.getContext('2d');
        if(event.buttons === 4){
            // TODO shortcut for panning
        }
        let inputEvent = {
            clientX : event.clientX,
            clientY : event.clientY,
            leftOffset: this.leftOffset,
            topOffset: this.topOffset,
            scaleFactor: this.state.scaleFactor,
            buttons : event.buttons,
            type : event.type,
        }
        let newItem = this.state.tool.handleEvent(inputEvent, context);
        if(newItem != null){
            this.versionController.push(newItem);
            if(newItem.type === 'pan'){
                this.leftOffset = newItem.leftOffset;
                this.topOffset = newItem.topOffset;
            }
            if(!newItem.indicator){
                this.pushCanvas();
            }
            this.clearCanvas();
            this.versionController.redrawCanvas(this.state.drawSurface);
        }
        event.preventDefault();
    }
    clearCanvas = () => {
        let context = this.state.drawSurface.current.getContext('2d');
        const width = context.canvas.width;
        const height = context.canvas.height;
        context.clearRect(0, 0, width, height);
    }
    pushCanvas = () => {
        axios.put(`${process.env.MIX_APP_URL}/api/p/${this.props.paintingId}`,
                  { strokes: JSON.stringify(this.versionController.versionHistory) },
            { headers: { 'Content-Type' : 'application/json' }})
        .then( response => {
            if(response.status === 401){ // not logged in
                window.location.replace(`${process.env.MIX_APP_URL}/login`);
            }
            else if(response.status === 403){ // not authorized
                alert('You do not have permissions to edit this item.');
                this.versionController.undo(this.state.drawSurface);
            }
        })
    }
    getCanvas = () => {
        axios.get(`${process.env.MIX_APP_URL}/api/p/${this.props.paintingId}`)
        .then( response => {
            this.setState({
                title: response.data.title
            });
            for(const item of response.data.strokes){
                this.versionController.push(item);
            }
            this.versionController.redrawCanvas(this.state.drawSurface);
        });
        this.setState({
            loading: false
        });
    }
    zoomIn = () => {
        this.setState({
            scaleFactor: this.state.scaleFactor + 0.25
        }, () => this.scaleCanvas());
    }
    zoomOut = () => {
        this.setState({
            scaleFactor: this.state.scaleFactor - 0.25
        }, () => this.scaleCanvas());
    }
    resetZoom = () => {
        this.setState({
            scaleFactor: 1
        }, () => this.scaleCanvas());
    }
    handleZoom = (event) => {
        if(event.deltaY < 0){
            this.zoomIn();
        }
        else{
            this.zoomOut();
        }
    }
    scaleCanvas = () => {
        let ctx = this.state.drawSurface.current.getContext('2d');
        this.clearCanvas();
        ctx.resetTransform();
        ctx.scale(this.state.scaleFactor, this.state.scaleFactor);
        this.versionController.redrawCanvas(this.state.drawSurface);
    }
    render(){
        return(
            <div className="container col px-5 Canvas">
                <MenuBar 
                    title={this.state.title}
                    surface={this.state.drawSurface} 
                    paintingId={this.props.paintingId}
                />
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
                        }}>
                            Redo
                        </button>
                        <button onClick={ (event) => { 
                            this.clearCanvas();
                            this.versionController.wipeHistory();
                            this.pushCanvas();
                        }}>
                            Clear
                        </button>
                        <button onClick={this.zoomIn}>
                            Zoom In
                        </button>
                        <span>Zoom Level: {this.state.scaleFactor}x </span>
                        <button onClick={this.zoomOut}>
                            Zoom Out
                        </button>
                        <button onClick={this.resetZoom}>
                            Reset Zoom
                        </button>
                    </div>
                </div>
                { this.state.loading ?
                    <>
                        <canvas ref={this.state.drawSurface}></canvas>
                        <div className="spinner-border text-success" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </> :
                    <canvas className="row" id="drawSurface"
                        onMouseDown = {this.handleInput}
                        onMouseMove = {this.handleInput}
                        onMouseLeave = {this.handleInput}
                        onMouseUp = {this.handleInput}
                        onWheel = {this.handleZoom}
                        height = { window.innerHeight * .9 }
                        width = { window.innerWidth * .95 }
                        ref = { this.state.drawSurface } />
                }
            </div>
        )
    }
}

export default Canvas;
