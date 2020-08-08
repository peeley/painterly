import * as React from 'react';
import axios from 'axios';
import './Canvas.css';
import { ToolController } from './ToolController';
import { Tool, CanvasInputEvent } from './Tool';
import { PanStroke } from './PanTool';
import { VersionController } from './VersionController';
import { MenuBar } from './MenuBar';

interface CanvasProps {
    paintingId: number;
};

interface CanvasState {
    tool: Tool,
    title: string,
    loading: boolean,
    drawSurface: React.RefObject<HTMLCanvasElement>,
    scaleFactor: number
};

class Canvas extends React.Component<CanvasProps, CanvasState> {
    private versionController: VersionController;
    private leftBoundary: number = 0;
    private topBoundary: number = 0;
    private leftOffset: number = 0;
    private topOffset: number = 0;
    public state: CanvasState = {
        tool: new Tool('generic'),
        title: '',
        loading: true,
        drawSurface: React.createRef<HTMLCanvasElement>(),
        scaleFactor: 1.0,
    };
    constructor(props: CanvasProps) {
        super(props);
        this.versionController = new VersionController(this.props.paintingId, this.state.drawSurface);
    }
    componentDidMount() {
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey) {
                switch (event.key) {
                    case 'z':
                        this.versionController.undo();
                        break;
                    case 'y':
                        this.versionController.redo();
                        break;
                    default:
                }
            }
        });
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
    handleToolSelect = (tool: Tool): void => {
        this.setState({
            tool: tool
        });
    }
    handleInput = (event: React.MouseEvent<HTMLCanvasElement> ) => {
        if(!this.state.drawSurface.current){
            return;
        }
        let context = this.state.drawSurface.current.getContext('2d');
        if(!context){
            return;
        }
        if (event.buttons === 4) {
            // TODO shortcut for panning
        }
        let inputEvent: CanvasInputEvent = {
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
            }
            this.clearCanvas();
            this.versionController.redrawCanvas();
        }
        event.preventDefault();
    }
    clearCanvas(){
        if(!this.state.drawSurface.current){
            return;
        }
        let context = this.state.drawSurface.current.getContext('2d');
        if(!context){
            return;
        }
        const width = context.canvas.width;
        const height = context.canvas.height;
        context.clearRect(0, 0, width, height);
    }
    getCanvas(){
        axios.get(`${process.env.MIX_APP_URL}/api/p/${this.props.paintingId}`)
            .then(response => {
                this.setState({
                    title: response.data.title
                });
                this.versionController.deserializeHistory(response.data.strokes);
            })
            .then(() => this.setState({
                loading: false
            }, () => {
                this.setBoundaries();
                this.versionController.redrawCanvas();
            }));
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
    handleZoom = (event: React.WheelEvent) => {
        if (event.deltaY < 0) {
            this.zoomIn();
        }
        else {
            this.zoomOut();
        }
    }
    scaleCanvas(){
        if(this.state.drawSurface.current){
            let ctx = this.state.drawSurface.current.getContext('2d');
            if(ctx){
                this.setBoundaries();
                this.clearCanvas();
                ctx.resetTransform();
                ctx.scale(this.state.scaleFactor, this.state.scaleFactor);
                this.versionController.redrawCanvas();
            }
        }
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
                        handleToolSelect = { this.handleToolSelect } />
                    <div className="versionButtons pt-2 pl-5" >
                        <button onClick={ () => {
                            this.versionController.undo()}}>
                            Undo
                        </button>
                        <button onClick = { () => {
                            this.versionController.redo()
                            }}>
                            Redo
                        </button>
                        <button onClick = { () => {
                            this.clearCanvas();
                            this.versionController.wipeHistory();
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
