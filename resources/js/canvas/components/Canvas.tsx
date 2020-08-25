import * as React from 'react';
import axios from 'axios';
import './Canvas.css';
import { ToolController } from './ToolController';
import { Tool, CanvasInputEvent } from './Tool';
import { PanHandler } from './PanHandler';
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
    scaleFactor: number,
    panning: boolean,
};

class Canvas extends React.Component<CanvasProps, CanvasState> {
    private versionController: VersionController;
    private leftBoundary: number = 0;
    private topBoundary: number = 0;
    private leftOffset: number = 0;
    private topOffset: number = 0;
    private panHandler: PanHandler;
    public state: CanvasState = {
        tool: new Tool('generic'),
        title: '',
        loading: true,
        drawSurface: React.createRef<HTMLCanvasElement>(),
        scaleFactor: 1.0,
        panning: false,
    };
    constructor(props: CanvasProps) {
        super(props);
        this.versionController = new VersionController(this.props.paintingId, this.state.drawSurface);
        this.panHandler = new PanHandler();
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
            this.leftBoundary = rect.left;
            this.topBoundary = rect.top;
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
        let inputEvent: CanvasInputEvent = {
            clientX: event.clientX,
            clientY: event.clientY,
            leftOffset: this.leftOffset,
            topOffset: this.topOffset,
            scaleFactor: this.state.scaleFactor,
            buttons: event.buttons,
            type: event.type,
        }
        if (event.buttons === 4 || this.state.panning) {
            this.setState({
                panning: event.buttons === 4
            });
            let [shiftedX, shiftedY] = this.panHandler.pan(inputEvent, context);
            this.leftOffset = this.leftBoundary - (shiftedX * this.state.scaleFactor);
            this.topOffset = this.topBoundary - (shiftedY * this.state.scaleFactor);
            this.clearCanvas();
            this.versionController.redrawCanvas();
        }
        else{
            let newStroke = this.state.tool.handleEvent(inputEvent, context);
            if (newStroke) {
                this.versionController.push(newStroke);
                this.clearCanvas();
                this.versionController.redrawCanvas();
            }
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
    zoom = (diff: number) => {
        this.setState({
            scaleFactor: this.state.scaleFactor + diff
        }, () => this.scaleCanvas());
    }
    resetZoom = () => {
        this.setState({
            scaleFactor: 1
        }, () => {
            this.scaleCanvas();
        });
    }
    handleZoom = (event: React.WheelEvent) => {
        if (event.deltaY < 0) {
            this.zoom(0.25);
        }
        else {
            this.zoom(-0.25);
        }
    }
    scaleCanvas(){
        this.panHandler.resetDistanceShifted();
        this.setBoundaries();
        if(this.state.drawSurface.current){
            let ctx = this.state.drawSurface.current.getContext('2d');
            if(ctx){
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
                        <button onClick = { () => this.zoom(0.25) } >
                            Zoom In
                        </button>
                        <span> Zoom Level: { this.state.scaleFactor } x </span>
                        <button disabled={this.state.scaleFactor <= 0.25}
                            onClick = { () => this.zoom(-0.25) } >
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
                    <div className="row px-2 pt-1 pb-4 overflow-hidden">
                        <canvas id="drawSurface"
                            onMouseDown = { this.handleInput }
                            onMouseMove = { this.handleInput }
                            onMouseLeave = { this.handleInput }
                            onMouseUp = { this.handleInput }
                            onWheel = { this.handleZoom }
                            height = { window.innerHeight * .875 }
                            width = { window.innerWidth }
                            ref = { this.state.drawSurface } />
                    </div>
                }
            </div>
        )
    }
}

export default Canvas;
