import React from 'react';
import { Palette } from './Palette.js';
import { PenTool } from './PenTool.js';
import { RectTool } from './RectTool.js';

export class ToolController extends React.Component{
    constructor(props){
        super(props);
        this.selectNewTool = this.selectNewTool.bind(this);
        this.state = {
            selected: "pen"
        };
    }
    handleChange(event){
        let toolName = event.target.value;
        this.setState({
            selected: toolName
        });
        this.props.selectTool(toolName);
    }
    componentDidMount(){
        this.toolSet = {
            'pen': new PenTool(this.props.surface),
            'rect': new RectTool(this.props.surface)
        }
        this.selectedTool = this.toolSet['pen'];
    }
    selectNewTool(toolName){
        this.selectedTool = this.toolSet[toolName];
        this.props.handleToolSelect(this.selectedTool);
    }
    setStrokeWidth(width){
        this.selectedTool.setStrokeWidth(width);
    }
    setColor(color){
        this.selectedTool.setColor(color);
    }
    render(){
        return(
            <div className="controlBar">
                <Palette 
                    updateStrokeWidth={this.setStrokeWidth}
                    updateColor={this.setColor}
                />
                <input type="radio" value="pen" id="pen" 
                    checked={this.state.selected === "pen"} 
                    onChange={this.handleChange} />
                <label htmlFor="pen"> Pen </label>

                <input type="radio" value="rect" id="rect" 
                    checked={this.state.selected === "rect"} 
                    onChange={this.handleChange} />
                <label htmlFor="rect"> Rect </label>
            </div>
        );
    }
}
