import * as React from 'react';
import axios from 'axios';
import { fabric } from 'fabric';
import './Canvas.css';
import { ToolController } from './ToolController';
import { Tool, CanvasInputEvent } from './Tool';
import { PenTool } from './PenTool';
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
    scaleFactor: number,
};

class Canvas extends React.Component<CanvasProps, CanvasState> {
    private versionController: VersionController;
    private panHandler: PanHandler;
    private panning: boolean;
    private drawSurface: fabric.Canvas;
    public state: CanvasState = {
        tool: new PenTool(),
        title: '',
        loading: true,
        scaleFactor: 1.0,
    };
    constructor(props: CanvasProps) {
        super(props);
        this.drawSurface = new fabric.Canvas('drawSurface', {
            fireRightClick: true,
            fireMiddleClick: true,
            stopContextMenu: true,
        });
        this.mountFabric();
        this.versionController = new VersionController(this.props.paintingId, this.drawSurface);
        this.panning = false;
        this.panHandler = new PanHandler();
    }
    componentDidMount() {
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey) {
                switch (event.key) {
                    case 'z':
                        //this.versionController.undo();
                        break;
                    case 'y':
                        //this.versionController.redo();
                        break;
                    default:
                }
            }
        });
        this.getCanvas();
    }
    handleToolSelect = (tool: Tool): void => {
        this.state.tool.deselect(this.drawSurface);
        this.setState({
            tool: tool
        }, () => this.state.tool.select(this.drawSurface));
    }
    handleInput = (type: string, event: fabric.IEvent) => {
        // TODO clean up, maybe consolidate pan stuff into PanHandler
        if (event.button === 2) {
            this.panning = type === 'mouse:down';
        }
        if (this.panning) {
            console.log('panning');
            this.panHandler.pan(type, event, this.drawSurface);
        }
        else {
            this.state.tool.handleEvent(type, event, this.drawSurface);
        }
    }
    clearCanvas() {
        this.drawSurface.clear();
    }
    mountFabric = () => {
        this.drawSurface.on({
            'mouse:down': (o) => this.handleInput('mouse:down', o),
            'mouse:move': (o) => this.handleInput('mouse:move', o),
            'mouse:up': (o) => this.handleInput('mouse:up', o),
            'mouse:wheel': this.handleZoom,
            'object:added': (_) => console.log('object added'),
        });
        this.drawSurface.selection = false;
        this.drawSurface.forEachObject((obj) => { obj.selectable = false });
    }
    getCanvas() {
        axios.get(`${process.env.MIX_APP_URL}/api/p/${this.props.paintingId}`)
            .then(response => {
                this.setState({
                    title: response.data.title
                });
                // this.versionController.deserializeHistory(response.data.strokes);
            })
            .then(() => this.setState({
                loading: false
            }, () => {
                this.drawSurface = new fabric.Canvas('drawSurface', {
                    fireRightClick: true,
                    fireMiddleClick: true,
                    stopContextMenu: true,
                });
                this.mountFabric();
                this.handleToolSelect(this.state.tool);
            }
            ));
    }
    zoom = (x: number, y: number, factor: number) => {
        if (factor > 0) {
            this.setState({
                scaleFactor: factor
            }, () => {
                this.drawSurface.zoomToPoint(new fabric.Point(x, y),
                    this.state.scaleFactor)
            });
        }
    }
    resetZoom = () => {
        this.setState({
            scaleFactor: 1.0
        }, () =>
            this.drawSurface.setViewportTransform([1, 0, 0, 1, 0, 0])
        );
    }
    handleZoom = (event: any) => {
        let wheelEvent: MouseWheelEvent = event.e;
        if (wheelEvent.deltaY < 0) {
            this.zoom(wheelEvent.offsetX, wheelEvent.offsetY, this.state.scaleFactor + 0.25);
        }
        else {
            this.zoom(wheelEvent.offsetX, wheelEvent.offsetY, this.state.scaleFactor - 0.25);
        }
    }
    render(): JSX.Element {
        let canvasStyle = {
            visibility: this.state.loading ? "hidden" as "hidden" : "visible" as "visible"
        };
        return (
            <div className="container col px-5" >
                <div className="row pl-5" >
                    <ToolController
                        handleToolSelect={this.handleToolSelect} />
                    <div className="versionButtons pt-2 pl-5" >
                        <button onClick={() => {
                            // this.versionController.undo()
                        }}>
                            Undo
                        </button>
                        <button onClick={() => {
                            // this.versionController.redo()
                        }}>
                            Redo
                        </button>
                        <button onClick={() => {
                            this.clearCanvas();
                            // this.versionController.wipeHistory();
                        }}>
                            Clear
                        </button>
                        <button onClick={() => this.zoom(0, 0, this.state.scaleFactor + 0.25)} >
                            Zoom In
                        </button>
                        <span> Zoom Level: {this.state.scaleFactor} x </span>
                        <button disabled={this.state.scaleFactor <= 0.25}
                            onClick={() => this.zoom(0, 0, this.state.scaleFactor - 0.25)} >
                            Zoom Out
                        </button>
                        <button onClick={this.resetZoom} >
                            Reset Zoom
                        </button>
                    </div>
                </div>
                {this.state.loading
                    ? <div className="spinner-border text-success" role="status" >
                            <span className="sr-only" > Loading...</span>
                      </div>
                    : null
                }
                <canvas className="row" id="drawSurface"
                    style={canvasStyle}
                    height={window.innerHeight * .85}
                    width={window.innerWidth * .975} />
            </div>
        )
    }
}

export default Canvas;
