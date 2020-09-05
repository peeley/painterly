import * as React from 'react';
import { Tool } from './Tool';
import { Palette } from './Palette';
import { PenTool } from './PenTool';
import { RectTool } from './RectTool';
import { FillTool } from './FillTool';
import { SelectorTool } from './SelectorTool';

interface ToolControllerProps {
    handleToolSelect(tool: Tool): void,
};

interface ToolControllerState {
    selectedName: string,
};

export class ToolController extends React.Component<ToolControllerProps, ToolControllerState>{
    private toolSet: object;
    private selectedTool: Tool;
    public state = {
        selectedName: "pen"
    };
    constructor(props: ToolControllerProps){
        super(props);
        this.toolSet = {
            'pen': new PenTool(),
            'rect': new RectTool(),
            'fill' : new FillTool(),
            'selector': new SelectorTool(),
        }
        this.selectedTool = this.toolSet['pen'];
        this.props.handleToolSelect(this.selectedTool);
    }
    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let toolName = event.target.value;
        this.setState({
            selectedName: toolName
        }, () => this.selectNewTool(toolName));
    }
    selectNewTool = (toolName: string) => {
        this.selectedTool = this.toolSet[toolName];
        this.props.handleToolSelect(this.selectedTool);
    }
    setStrokeWidth = (width: number) => {
        this.selectedTool.setStrokeWidth(width);
    }
    setColor = (color: string) => {
        for(let toolName in this.toolSet){
            this.toolSet[toolName].setColor(color);
        }
    }
    toolListJSX(): Array<JSX.Element> {
        let toolList: Array<JSX.Element> = [];
        for(let name in this.toolSet){
            let displayName = this.toolSet[name].displayName;
            toolList.push(
                <div className="pr-3" key={name}>
                    <input type="radio" value={name} id={name}
                        checked={this.state.selectedName === name}
                        onChange={this.handleChange} />
                    <label htmlFor={name}> {displayName} </label>
                </div>
            );
        }
        return toolList;
    }
    render(){
        return(
            <div className="row controlBar">
                <Palette
                    updateStrokeWidth={this.setStrokeWidth}
                    updateColor={this.setColor}
                />
                <div className="row toolList pt-2">
                    {this.toolListJSX()}
                </div>
            </div>
        );
    }
}
