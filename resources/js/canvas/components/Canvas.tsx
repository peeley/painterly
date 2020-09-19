import * as React from 'react';
import axios from 'axios';
import { fabric } from 'fabric';
import './Canvas.css';
import { ToolController } from './ToolController';
import { Tool, MouseEventType } from './Tools/Tool';
import { PenTool } from './Tools/PenTool';
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
    syncing: boolean,
};

const CanvasId = 'drawSurface'

const DefaultBackgroundColor = 'rgba(255, 255, 248, 1)';

class Canvas extends React.Component<CanvasProps, CanvasState> {
    private versionController: VersionController;
    private panHandler: PanHandler;
    private drawSurface: fabric.Canvas;
    public state: CanvasState = {
        tool: new PenTool(),
        title: '',
        loading: true,
        scaleFactor: 1.0,
        syncing: false,
    };
    constructor(props: CanvasProps) {
        super(props);
        this.drawSurface = new fabric.Canvas(CanvasId, {
            fireMiddleClick: true,
        });
        this.versionController = new VersionController(this.props.paintingId, this.drawSurface, this.setSyncing);
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
                this.versionController.push({ target: o.path });
            },
            'push:added': this.versionController.push,
            'object:modified': this.versionController.modify,
            'push:removed': this.versionController.remove,
            'dragenter': (o) => console.log('dragenter', o),
            'dragover': (o: any) => {
                console.log('dragover', o);
                o.e.dataTransfer.dropEffect = 'link';
            },
            'dragleave': (o) => console.log('dragleave', o),
            'drop': (o) => {
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
                        this.versionController.undo();
                        break;
                    case 'y':
                        this.versionController.redo();
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
    }
    setSyncing = (isSyncing: boolean) => {
        this.setState({
            syncing: isSyncing
        });
    }
    getCanvas() {
        this.setState({ syncing: true });
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
                    this.versionController.setDrawSurface(this.drawSurface);
                    this.versionController.deserializeHistory(response.data.objects);
                    this.versionController.mountChannelListener();
                    this.handleToolSelect(this.state.tool);
                    this.mountFabric();
                    this.drawSurface.setBackgroundColor(DefaultBackgroundColor, () => {
                        this.drawSurface.renderAll();
                        console.log(this.drawSurface.backgroundColor);
                    });
                    this.setState({ syncing: false});
                });
            });
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
                    syncing={this.state.syncing} />
                <div className="row px-5 d-flex justify-content-around" >
                    <ToolController
                        handleToolSelect={this.handleToolSelect} />
                    <div className="btn-group pb-2 pl-3" >
                        <button className="btn btn-outline-secondary"
                            onClick={() => {
                            this.versionController.undo()
                        }}>
                            <i className="fas fa-undo" title="Undo"></i>
                        </button>
                        <button className="btn btn-outline-secondary"
                            onClick={() => {
                            this.versionController.redo()
                        }}>
                            <i className="fas fa-redo" title="Redo"></i>
                        </button>
                        <button className="btn btn-outline-secondary"
                            onClick={() => {
                            this.clearCanvas();
                            this.versionController.wipeHistory();
                        }}>
                            Clear
                        </button>
                        <button className="btn btn-outline-secondary"
                            onClick={() => this.zoom(0, 0, this.state.scaleFactor + 0.25)} >
                            <i className="fas fa-search-plus" title="Zoom In"></i>
                        </button>
                        <span className="px-2 pt-2"> Zoom Level: {this.state.scaleFactor} x </span>
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
