import axios from 'axios';
import { fabric } from 'fabric';
import * as React from 'react';
import { CanvasEventHandler } from '../lib/CanvasEventHandler';
import { IncomingBroadcastHandler } from '../lib/IncomingBroadcastHandler';
import { PanHandler } from "../lib/PanHandler";
import { MouseInputType } from "../lib/Tools/MouseInputType";
import { PenTool } from '../lib/Tools/PenTool';
import { Tool } from '../lib/Tools/Tool';
import { MenuBar } from './MenuBar';
import { ToolBar } from './ToolController';

interface CanvasProps {
    paintingId: number;
};

interface CanvasState {
    tool: Tool,
    title: string,
    loading: boolean,
    scaleFactor: number,
    isSyncing: boolean,
};

const CanvasElementId = 'canvasElement'

class Canvas extends React.Component<CanvasProps, CanvasState> {
    private broadcastHandler: IncomingBroadcastHandler;
    private eventHandler: CanvasEventHandler;
    private panHandler: PanHandler;
    private canvas: fabric.Canvas;
    // TODO remove tool from state, just get current tool from tool controller
    public state: CanvasState;
    constructor(props: CanvasProps) {
        super(props);
        this.canvas = new fabric.Canvas(CanvasElementId, {
            fireMiddleClick: true,
        });
        this.state = {
            tool: new PenTool(),
            title: '',
            loading: true,
            scaleFactor: 1.0,
            isSyncing: true,
        };
        this.broadcastHandler = new IncomingBroadcastHandler(
            this.props.paintingId,
            this.canvas,
        );
        this.eventHandler = new CanvasEventHandler(
            this.props.paintingId,
            this.canvas,
            this.setSyncing
        );
        this.panHandler = new PanHandler();
    }
    componentDidMount() {
        this.fetchCanvas();
    }
    handleToolSelect = (tool: Tool): void => {
        this.state.tool.deselect(this.canvas);
        this.setState({
            tool: tool
        }, () =>
            tool.select(this.canvas)
        );
    }
    handleInput = (type: MouseInputType, event: fabric.IEvent) => {
        if (event.button === 2 || this.panHandler.isPanning()) {
            this.panHandler.pan(type, event, this.canvas);
            this.canvas.forEachObject(obj => obj.setCoords());
        }
        else {
            this.state.tool.handleEvent(type, event, this.canvas);
        }
    }
    clearCanvas() {
        this.canvas.clear();
    }
    mountCanvasEventListeners = () => {
        this.canvas.on({
            'mouse:down': (event) => this.handleInput('mouse:down', event),
            'mouse:move': (event) => this.handleInput('mouse:move', event),
            'mouse:up': (event) => this.handleInput('mouse:up', event),
            'mouse:wheel': this.handleZoom,
            'path:created': (event: any) => {
                this.eventHandler.handleLocalAddEvent({ target: [event.path] });
            },
            'push:added': this.eventHandler.handleLocalAddEvent,
            'object:modified': this.eventHandler.handleLocalModifyEvent,
            'finished:modified': (_) => {
                this.canvas.on('object:modified', this.eventHandler.handleLocalModifyEvent);
            },
            'push:removed': this.eventHandler.handleLocalRemoveEvent,
            'dragenter': (event) => console.log('dragenter', event),
            'dragover': (event: any) => {
                console.log('dragover', event);
            },
            'selection:created': (event) => {
                if (event.target) {
                    event.target.lockScalingFlip = true;
                }
            },
            // 'text:changed': this.eventHandler.modify,
            'dragleave': (event) => console.log('dragleave', event),
            'drop': (event) => {
                console.log("dropped file here!");
                event.e.preventDefault();
                console.log(event);
            }
        });
        this.canvas.selection = false;
        const canvasElement = document.getElementById('canvasWrapper');
        if (!canvasElement) {
            throw Error("Unable to find canvas element.");
        }
        canvasElement.tabIndex = 1000;
        canvasElement.addEventListener('keydown', (event) => {
            if (event.ctrlKey) {
                switch (event.key) {
                    case 'z':
                        this.eventHandler.handleUndo();
                        break;
                    case 'y':
                        this.eventHandler.handleRedo();
                        break;
                    default:
                }
            }
            else if (event.key === 'Delete' || event.key === 'Backspace') {
                const removedObject = this.canvas.getActiveObject();
                this.canvas.remove(removedObject);
                this.canvas.fire('push:removed', { target: removedObject });
            }
        });
        this.canvas.setBackgroundColor("#181A1B", () => { });
    }
    setSyncing = (isSyncing: boolean) => {
        this.setState({
            isSyncing: isSyncing
        });
    }
    fetchCanvas() {
        axios.get(`${process.env.MIX_APP_URL}/api/p/${this.props.paintingId}`)
            .then(response => {
                this.setState({
                    title: response.data.title,
                    loading: false
                }, () => {
                    this.canvas = new fabric.Canvas(CanvasElementId, {
                        fireRightClick: true,
                        fireMiddleClick: true,
                        stopContextMenu: false,
                    });
                    // need to set canvas again after loading finishes
                    this.eventHandler.setCanvas(this.canvas);
                    this.eventHandler.deserializeHistory(response.data.objects);
                    if (response.data.objects.length === 0) {
                        this.eventHandler.pushPreview(); // make preview blank
                    }

                    this.broadcastHandler.setCanvas(this.canvas);
                    this.broadcastHandler.mountChannelListener();

                    this.state.tool.select(this.canvas);
                    this.mountCanvasEventListeners();
                    this.setState({ isSyncing: false });
                });
            });
    }
    // TODO refactor zoom controls into separate component
    zoom = (x: number, y: number, factor: number) => {
        if (factor > 0) {
            this.setState({
                scaleFactor: factor
            }, () => {
                this.canvas.zoomToPoint(new fabric.Point(x, y),
                    this.state.scaleFactor)
            });
        }
    }
    resetZoom = () => {
        this.setState({
            scaleFactor: 1.0
        }, () => {
            this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
            this.canvas.forEachObject(obj => obj.setCoords());
        });
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
    formatScaleFactor() {
        const scale = this.state.scaleFactor;
        return scale.toLocaleString('US-us', {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    render(): JSX.Element {
        let canvasStyle = {
            visibility: this.state.loading ? "hidden" as "hidden" : "visible" as "visible"
        };
        return (
            <div className="container col px-5" >
                <MenuBar
                    title={this.state.title}
                    surface={this.canvas}
                    paintingId={this.props.paintingId}
                    isCanvasSyncing={this.state.isSyncing} />
                <div className="row d-flex justify-content-around">
                    <ToolBar
                        handleToolSelect={this.handleToolSelect} />
                    <div className="btn-group pb-2 pl-3" >
                        <button className="btn btn-outline-secondary"
                            disabled={!this.eventHandler.canUndo()}
                            onClick={() => {
                                this.eventHandler.handleUndo()
                            }}>
                            <i className="fas fa-undo" title="Undo"></i>
                        </button>
                        <button className="btn btn-outline-secondary"
                            disabled={!this.eventHandler.canRedo()}
                            onClick={() => {
                                this.eventHandler.handleRedo()
                            }}>
                            <i className="fas fa-redo" title="Redo"></i>
                        </button>
                        <button className="btn btn-outline-secondary"
                            onClick={() => {
                                this.clearCanvas();
                                this.eventHandler.wipeHistory();
                            }}>
                            Clear
                        </button>
                        <button className="btn btn-outline-secondary"
                            onClick={() => this.zoom(0, 0, this.state.scaleFactor + 0.25)} >
                            <i className="fas fa-search-plus" title="Zoom In"></i>
                        </button>
                        <span className="px-2 pt-2 zoomIndicator">
                            Zoom: {this.formatScaleFactor()}x </span>
                        <button className="btn btn-outline-secondary"
                            disabled={this.state.scaleFactor <= 0.25}
                            onClick={() => this.zoom(0, 0, this.state.scaleFactor - 0.25)} >
                            <i className="fas fa-search-minus" title="Zoom Out"></i>
                        </button>
                        <button className="btn btn-outline-secondary"
                            onClick={this.resetZoom} >
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
                <div id="canvasWrapper">
                    <canvas className="row" id={CanvasElementId}
                        style={canvasStyle}
                        height={window.innerHeight * .85}
                        width={window.innerWidth * .95} />
                </div>
            </div>
        )
    }
}

export default Canvas;
