import * as React from 'react';
import axios from 'axios';
import { fabric } from 'fabric';
import { ToolController } from './ToolController';
import { Tool, MouseEventType } from './Tools/Tool';
import { PenTool } from './Tools/PenTool';
import { PanHandler } from './PanHandler';
import { EventHandler } from './EventHandler';
import { MenuBar } from './MenuBar';

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

const CanvasId = 'drawSurface'

class Canvas extends React.Component<CanvasProps, CanvasState> {
    private eventHandler: EventHandler;
    private panHandler: PanHandler;
    private drawSurface: fabric.Canvas;
    // TODO remove tool from state, just get current tool from tool controller
    public state: CanvasState = {
        tool: new PenTool(),
        title: '',
        loading: true,
        scaleFactor: 1.0,
        isSyncing: false,
    };
    constructor(props: CanvasProps) {
        super(props);
        this.drawSurface = new fabric.Canvas(CanvasId, {
            fireMiddleClick: true,
        });
        this.eventHandler = new EventHandler(this.props.paintingId, this.drawSurface, this.setSyncing);
        this.panHandler = new PanHandler();
    }
    componentDidMount() {
        this.getCanvas();
    }
    handleToolSelect = (tool: Tool): void => {
        this.state.tool.deselect(this.drawSurface);
        this.setState({
            tool: tool
        }, () => this.state.tool.select(this.drawSurface));
    }
    handleInput = (type: MouseEventType, event: fabric.IEvent) => {
        if (event.button === 2 || this.panHandler.isPanning()) {
            this.panHandler.pan(type, event, this.drawSurface);
            this.drawSurface.forEachObject(obj => obj.setCoords());
        }
        else {
            this.state.tool.handleEvent(type, event, this.drawSurface);
        }
    }
    clearCanvas() {
        this.drawSurface.clear();
    }
    mountFabric = () => {
        console.log('mounting event listeners');
        this.drawSurface.on({
            'mouse:down': (o) => this.handleInput('mouse:down', o),
            'mouse:move': (o) => this.handleInput('mouse:move', o),
            'mouse:up': (o) => this.handleInput('mouse:up', o),
            'mouse:wheel': this.handleZoom,
            'path:created': (o: any) => {
                this.eventHandler.handleLocalAdd({ target: [o.path] });
            },
            'push:added': this.eventHandler.handleLocalAdd,
            'object:modified': this.eventHandler.handleLocalModify,
            'push:removed': this.eventHandler.handleLocalRemove,
            'dragenter': (o) => console.log('dragenter', o),
            'dragover': (o: any) => {
                console.log('dragover', o);
            },
            'selection:created': (o) => {
                if(o.target){
                    o.target.lockScalingFlip = true;
                }
            },
            // 'text:changed': this.eventHandler.modify,
            'dragleave': (o) => console.log('dragleave', o),
            'drop': (o) => {
                console.log("dropped file here!");
                o.e.preventDefault();
                console.log(o);
            }
        });
        this.drawSurface.selection = false;
        const canvasElement = document.getElementById('canvasWrapper');
        if (!canvasElement) {
            throw Error("Unable to find canvas element.");
        }
        canvasElement.tabIndex = 1000;
        canvasElement.addEventListener('keydown', (event) => {
            console.log(event);
            if (event.ctrlKey) {
                switch (event.key) {
                    case 'z':
                        this.eventHandler.undo();
                        break;
                    case 'y':
                        this.eventHandler.redo();
                        break;
                    default:
                }
            }
            else if (event.key === 'Delete' || event.key === 'Backspace') {
                const removedObject = this.drawSurface.getActiveObject();
                this.drawSurface.remove(removedObject);
                this.drawSurface.fire('push:removed', { target: removedObject });
            }
        });
        this.drawSurface.setBackgroundColor("#181A1B", () => {});
    }
    setSyncing = (isSyncing: boolean) => {
        this.setState({
            isSyncing: isSyncing
        });
    }
    getCanvas() {
        this.setState({ isSyncing: true });
        axios.get(`${process.env.MIX_APP_URL}/api/p/${this.props.paintingId}`)
            .then(response => {
                this.setState({
                    title: response.data.title
                });
                this.setState({
                    loading: false
                }, () => {
                    this.drawSurface = new fabric.Canvas('drawSurface', {
                        fireRightClick: true,
                        fireMiddleClick: true,
                        stopContextMenu: false,
                    });
                    // need to set draw surface again after loading finishes
                    this.eventHandler.setDrawSurface(this.drawSurface);
                    this.eventHandler.deserializeHistory(response.data.objects);
                    if(response.data.objects.length === 0){
                        this.eventHandler.pushPreview(); // make preview blank
                    }
                    this.eventHandler.mountChannelListener();
                    this.handleToolSelect(this.state.tool);
                    this.mountFabric();
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
                this.drawSurface.zoomToPoint(new fabric.Point(x, y),
                    this.state.scaleFactor)
            });
        }
    }
    resetZoom = () => {
        this.setState({
            scaleFactor: 1.0
        }, () => {
            this.drawSurface.setViewportTransform([1, 0, 0, 1, 0, 0]);
            this.drawSurface.forEachObject(obj => obj.setCoords());
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
    formatScaleFactor(){
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
                    surface={this.drawSurface}
                    paintingId={this.props.paintingId}
                    isCanvasSyncing={this.state.isSyncing} />
                <div className="row d-flex justify-content-around">
                    <ToolController
                        handleToolSelect={this.handleToolSelect} />
                    <div className="btn-group pb-2 pl-3" >
                        <button className="btn btn-outline-secondary"
                            disabled={!this.eventHandler.canUndo()}
                            onClick={() => {
                                this.eventHandler.undo()
                            }}>
                            <i className="fas fa-undo" title="Undo"></i>
                        </button>
                        <button className="btn btn-outline-secondary"
                            disabled={!this.eventHandler.canRedo()}
                            onClick={() => {
                                this.eventHandler.redo()
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
                    <canvas className="row" id="drawSurface"
                        style={canvasStyle}
                        height={window.innerHeight * .85}
                        width={window.innerWidth * .95} />
                </div>
            </div>
        )
    }
}

export default Canvas;
