import * as React from 'react';
import axios from 'axios';
import './Canvas.css';
import { ToolController } from './ToolController';
import { Tool } from './Tool';
import { PanStroke } from './PanTool';
import { VersionController } from './VersionController';
import { MenuBar } from './MenuBar';

type CanvasProps = {
    paintingId: number;
};

type CanvasState = {
    tool: Tool,
    title: string,
    loading: boolean,
    drawSurface: React.RefObject<HTMLCanvasElement>,
    scaleFactor: number
}

class Canvas extends React.Component<CanvasProps, CanvasState> {
    private versionController: VersionController = new VersionController;
    private leftBoundary: number = 0;
    private topBoundary: number = 0;
    private leftOffset: number = 0;
    private topOffset: number = 0;
    state: CanvasState = {
        tool: new Tool('generic'),
        title: '',
        loading: true,
        drawSurface: React.createRef<HTMLCanvasElement>(),
        scaleFactor: 1.0,
    };
    constructor(props: CanvasProps) {
        super(props);
    }
    componentDidMount() {
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey) {
                switch (event.key) {
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
        this.setBoundaries();
        this.getCanvas();
    }
    setBoundaries(){
        if(this.state.drawSurface.current){
            let rect = this.state.drawSurface.current.getBoundingClientRect();
            this.leftBoundary = rect.left / this.state.scaleFactor;
            this.topBoundary = rect.top / this.state.scaleFactor;
            this.leftOffset = this.leftBoundary;
            this.topOffset = this.topBoundary;
        }
    }
    handleToolSelect(tool: Tool){
        this.setState({
            tool: tool
        });
    }
    handleInput(event: React.MouseEvent<HTMLCanvasElement> ) {
        let context = this.state.drawSurface.current.getContext('2d');
        if(context === null){
            return;
        }
        if (event.buttons === 4) {
            // TODO shortcut for panning
        }
        let inputEvent = {
            clientX: event.clientX,
            clientY: event.clientY,
            leftOffset: this.leftOffset,
            topOffset: this.topOffset,
            scaleFactor: this.state.scaleFactor,
            buttons: event.buttons,
            type: event.type,
        }
        let newItem = this.state.tool.handleEvent(inputEvent, context);
        if (newItem != null) {
            this.versionController.push(newItem);
            if (newItem instanceof PanStroke) {
                this.leftOffset = this.leftBoundary - newItem.shiftedX;
                this.topOffset = this.topBoundary - newItem.shiftedY;
                console.log(`updating offsets: left ${this.leftOffset}, top ${this.topOffset}`);
            }
            if (!newItem.getIndicator()) {
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
        let history = this.versionController.serializeHistory();
        axios.put(`${process.env.MIX_APP_URL}/api/p/${this.props.paintingId}`,
            { strokes: JSON.stringify(history) },
            { headers: { 'Content-Type': 'application/json' } })
            .then(response => {
                if (response.status === 401) { // not logged in
                    window.location.replace(`${process.env.MIX_APP_URL}/login`);
                }
                else if (response.status === 403) { // not authorized
                    alert('You do not have permissions to edit this item.');
                    this.versionController.undo(this.state.drawSurface);
                }
            })
    }
    getCanvas(){
        axios.get(`${process.env.MIX_APP_URL}/api/p/${this.props.paintingId}`)
            .then(response => {
                this.setState({
                    title: response.data.title
                });
                this.versionController.deserializeHistory(response.data.strokes);
                this.versionController.redrawCanvas(this.state.drawSurface);
            });
        this.setState({
            loading: false
        });
    }
    zoomIn(){
        this.setState({
            scaleFactor: this.state.scaleFactor + 0.25
        }, () => this.scaleCanvas());
    }
    zoomOut(){
        this.setState({
            scaleFactor: this.state.scaleFactor - 0.25
        }, () => this.scaleCanvas());
    }
    resetZoom(){
        this.setState({
            scaleFactor: 1
        }, () => this.scaleCanvas());
    }
    handleZoom(event: React.WheelEvent){
        if (event.deltaY < 0) {
            this.zoomIn();
        }
        else {
            this.zoomOut();
        }
    }
    scaleCanvas(){
        let ctx = this.state.drawSurface.current.getContext('2d');
        this.clearCanvas();
        ctx.resetTransform();
        ctx.scale(this.state.scaleFactor, this.state.scaleFactor);
        this.versionController.redrawCanvas(this.state.drawSurface);
    }
    render(): JSX.Element {
        return (
            <div className= "container col px-5" >
                <MenuBar
                    title={ this.state.title }
                    surface = { this.state.drawSurface }
                    paintingId = { this.props.paintingId } />
                <div className="row pl-5" >
                    <ToolController
                        surface={ this.state.drawSurface }
                        handleToolSelect = { this.handleToolSelect } />
                    <div className="versionButtons pt-2 pl-5" >
                        <button onClick={ () => {
                            this.versionController.undo(this.state.drawSurface)}}>
                            Undo
                        </button>
                        <button onClick = { () => {
                            this.versionController.redo(this.state.drawSurface)
                            }}>
                            Redo
                        </button>
                        <button onClick = { () => {
                            this.clearCanvas();
                            this.versionController.wipeHistory();
                            this.pushCanvas();
                            }}>
                            Clear
                        </button>
                        <button onClick = { this.zoomIn } >
                            Zoom In
                        </button>
                        <span> Zoom Level: { this.state.scaleFactor } x </span>
                        <button onClick = { this.zoomOut } >
                            Zoom Out
                        </button>
                        <button onClick = { this.resetZoom } >
                            Reset Zoom
                        </button>
                    </div>
                </div>
                { this.state.loading ?
                    <>
                        <canvas ref={ this.state.drawSurface }> </canvas>
                        <div className = "spinner-border text-success" role = "status" >
                            <span className="sr-only" > Loading...</span>
                        </div>
                    </> :
                    <canvas className = "row" id = "drawSurface"
                        onMouseDown = { this.handleInput }
                        onMouseMove = { this.handleInput }
                        onMouseLeave = { this.handleInput }
                        onMouseUp = { this.handleInput }
                        onWheel = { this.handleZoom }
                        height = { window.innerHeight * .9 }
                        width = { window.innerWidth * .95 }
                        ref = { this.state.drawSurface } />
                }
            </div>
        )
    }
}

export default Canvas;
