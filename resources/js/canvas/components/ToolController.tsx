import * as React from 'react';
import { Tool } from './Tools/Tool';
import { Palette } from './Palette';
import { PenTool } from './Tools/PenTool';
import { RectTool } from './Tools/RectTool';
import { LineTool } from './Tools/LineTool';
import { SelectorTool } from './Tools/SelectorTool';
import { TextTool } from './Tools/TextTool';

interface ToolControllerProps {
    handleToolSelect(tool: Tool): void,
};

type ToolName = "pen" | "rect" | "fill" | "text" | "selector" | "text";

interface ToolControllerState {
    selectedName: ToolName,
};

export class ToolController extends React.Component<ToolControllerProps, ToolControllerState>{
    private toolSet: object;
    private selectedTool: Tool;
    public state: ToolControllerState;
    constructor(props: ToolControllerProps) {
        super(props);
        this.toolSet = {
            'selector': new SelectorTool(),
            'pen': new PenTool(),
            'line': new LineTool(),
            'rect': new RectTool(),
            'text': new TextTool(),
        }
        this.state = {
            selectedName: "selector" as "selector"
        }
        this.selectedTool = this.toolSet[this.state.selectedName];
        this.props.handleToolSelect(this.selectedTool);
    }
    handleChange = (event: any /*React.MouseEvent<HTMLInputElement>*/) => {
        let toolName = event.target.value;
        this.setState({
            selectedName: toolName
        }, () => this.selectNewTool(toolName));
    }
    selectNewTool = (toolName: ToolName) => {
        this.selectedTool = this.toolSet[toolName];
        this.props.handleToolSelect(this.selectedTool);
    }
    setStrokeWidth = (width: number) => {
        this.selectedTool.setStrokeWidth(width);
    }
    setColor = (color: string) => {
        for (let toolName in this.toolSet) {
            this.toolSet[toolName].setColor(color);
        }
    }
    toolListJSX(): Array<JSX.Element> {
        return Object.keys(this.toolSet).map( (name: string) => {

            let displayName = this.toolSet[name].displayName;
            let icon = this.toolSet[name].getIcon();

            return (<label className="btn btn-outline-secondary" key={name}>
                <input type="radio" value={name} id={name}
                    checked={this.state.selectedName === name}
                    onClick={this.handleChange}
                    onChange={() => { }} />
                <i className={icon} title={displayName}></i>
            </label>);
        });
    }
    render() {
        return (
            <>
                <div className="col-2 btn-group btn-group-toggle pb-2"
                    data-toggle="buttons">
                    {this.toolListJSX()}
                </div>
                <Palette
                    updateStrokeWidth={this.setStrokeWidth}
                    updateColor={this.setColor}
                />
            </>
        );
    }
}
