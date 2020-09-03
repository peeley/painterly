import * as React from 'react';
import axios from 'axios';
import { fabric } from 'fabric';
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
    drawSurface: fabric.Canvas,
    scaleFactor: number,
    panning: boolean,
};

class Canvas extends React.Component<CanvasProps, CanvasState> {
    //private versionController: VersionController;
    //private panHandler: PanHandler;
    public state: CanvasState = {
        tool: new Tool('generic'),
        title: '',
        loading: true,
        drawSurface: new fabric.Canvas(''),
        scaleFactor: 1.0,
        panning: false,
    };
    constructor(props: CanvasProps) {
        super(props);
        //this.versionController = new VersionController(this.props.paintingId, this.state.drawSurface);
        //this.panHandler = new PanHandler();
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
        this.setState({
            tool: tool
        });
    }
    handleInput = (event: fabric.IEvent) => {
        console.log(JSON.stringify(event));
        if (event.button === 4 || this.state.panning) {
            // pan
        }
        else {
            // let stroke = this.state.tool.handleEvent(event, this.drawSurface);
        }
    }
    clearCanvas() {
        this.state.drawSurface.clear();
    }
    mountFabric = () => {
        this.setState({
            drawSurface: new fabric.Canvas('drawSurface')
        }, () => {
            this.state.drawSurface.isDrawingMode = true;
            this.state.drawSurface.freeDrawingBrush.width = 5;
            this.state.drawSurface.freeDrawingBrush.color = 'rgba(255, 0, 0, 1)';
            this.state.drawSurface.on('mouse:down', this.handleInput);
            this.state.drawSurface.on('mouse:wheel', this.handleZoom);
        });
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
            }, this.mountFabric
            ));
    }
    zoom = (x: number, y: number, factor: number) => {
        this.setState({
            scaleFactor: factor
        }, () =>
            this.state.drawSurface.zoomToPoint(new fabric.Point(x, y),
                                               this.state.scaleFactor)
        );
    }
    resetZoom = () => {
        this.setState({
            scaleFactor: 1.0
        }, () =>
            this.state.drawSurface.setViewportTransform([1,0,0,1,0,0])
        );
    }
    handleZoom = (event: any) => {
        if (event.e.deltaY < 0) {
            this.zoom(event.e.offsetX, event.e.offsetY, this.state.scaleFactor + 0.25);
        }
        else {
            this.zoom(event.e.offsetX, event.e.offsetY, this.state.scaleFactor - 0.25);
        }
    }
    render(): JSX.Element {
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
                {this.state.loading ?
                    <>
                        <canvas > </canvas>
                        <div className="spinner-border text-success" role="status" >
                            <span className="sr-only" > Loading...</span>
                        </div>
                    </> :
                    <canvas className="row" id="drawSurface"
                        height={window.innerHeight * .85}
                        width={window.innerWidth * .975} />
                }
            </div>
        )
    }
}

export default Canvas;
