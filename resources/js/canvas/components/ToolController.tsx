import * as React from 'react';
import { Tool } from './Tools/Tool';
import { Palette } from './Palette';
import { PenTool } from './Tools/PenTool';
import { RectTool } from './Tools/RectTool';
import { FillTool } from './Tools/FillTool';
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
    public state = {
        selectedName: "pen" as "pen"
    };
    constructor(props: ToolControllerProps) {
        super(props);
        this.toolSet = {
            'pen': new PenTool(),
            'rect': new RectTool(),
            'fill': new FillTool(),
            'text': new TextTool(),
            'selector': new SelectorTool(),
        }
        this.selectedTool = this.toolSet['pen'];
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
        let toolList: Array<JSX.Element> = [];
        for (let name in this.toolSet) {
            let displayName = this.toolSet[name].displayName;
            let icon = this.toolSet[name].getIcon();
            toolList.push(
                <label className="btn btn-outline-secondary" key={name}>
                    <input type="radio" value={name} id={name}
                        checked={this.state.selectedName === name}
                        onClick={this.handleChange}
                        onChange={() => { }} />
                <i className={icon} title={displayName}></i>
                </label>
            );
        }
        return toolList;
    }
    render() {
        return (
            <>
                <Palette
                    updateStrokeWidth={this.setStrokeWidth}
                    updateColor={this.setColor}
                />
                <div className="col-2 btn-group btn-group-toggle pb-2"
                    data-toggle="buttons">
                    {this.toolListJSX()}
                </div>
            </>
        );
    }
}
