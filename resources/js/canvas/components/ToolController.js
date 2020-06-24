import React from 'react';
import { Palette } from './Palette.js';
import { PenTool } from './PenTool.js';
import { RectTool } from './RectTool.js';
import { PanTool } from './PanTool.js';
import { FillTool } from './FillTool.js';

export class ToolController extends React.Component{
    /* TODO : update when static fields are widely compatible
    static toolSet = {
        'pen': new PenTool(),
        'rect': new RectTool()
    } */
    constructor(props){
        super(props);
        this.toolSet = {
            'pen': new PenTool(),
            'rect': new RectTool(),
            'pan' : new PanTool(),
            'fill' : new FillTool(),
        }
        this.selectedTool = this.toolSet['pen'];
        this.props.handleToolSelect(this.selectedTool);
        this.state = {
            selectedName: "pen"
        };
    }
    handleChange = (event) => {
        let toolName = event.target.value;
        this.setState({
            selectedName: toolName
        });
        this.selectNewTool(toolName);
    }
    selectNewTool = (toolName) => {
        this.selectedTool = this.toolSet[toolName];
        this.props.handleToolSelect(this.selectedTool);
    }
    setStrokeWidth = (width) => {
        this.selectedTool.setStrokeWidth(width);
    }
    setColor = (color) => {
        for(let toolName in this.toolSet){
            this.toolSet[toolName].setColor(color);
        }
    }
    toolListJSX = () => {
        let toolList = [];
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
