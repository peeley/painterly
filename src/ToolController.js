import React from 'react';
import { Palette } from './Palette.js';
import { PenTool } from './PenTool.js';
import { RectTool } from './RectTool.js';

export class ToolController extends React.Component{
    constructor(props){
        super(props);
        this.toolSet = {
            'pen': new PenTool('pen'),
            'rect': new RectTool('rect')
        }
        this.selectedTool = this.toolSet['pen'];
        this.props.handleToolSelect(this.selectedTool);
        this.handleChange = this.handleChange.bind(this);
        this.selectNewTool = this.selectNewTool.bind(this);
        this.setStrokeWidth = this.setStrokeWidth.bind(this);
        this.setColor = this.setColor.bind(this);
        this.state = {
            selectedName: "pen"
        };
    }
    componentDidUpdate(prevProps){
        if(this.props.surface.current){
            for(let toolName in this.toolSet){
                this.toolSet[toolName].setOffsets(this.props.surface);
            }
        }
    }
    handleChange(event){
        let toolName = event.target.value;
        this.setState({
            selectedName: toolName
        });
        this.selectNewTool(toolName);
    }
    selectNewTool(toolName){
        this.selectedTool = this.toolSet[toolName];
        this.props.handleToolSelect(this.selectedTool);
    }
    setStrokeWidth(width){
        this.selectedTool.setStrokeWidth(width);
    }
    setColor(color){
        for(let toolName in this.toolSet){
            this.toolSet[toolName].setColor(color);
        }
    }
    render(){
        return(
            <div className="controlBar">
                <Palette 
                    updateStrokeWidth={this.setStrokeWidth}
                    updateColor={this.setColor}
                />
                <input type="radio" value="pen" id="pen" 
                    checked={this.state.selectedName === "pen"} 
                    onChange={this.handleChange} />
                <label htmlFor="pen"> Pen </label>

                <input type="radio" value="rect" id="rect" 
                    checked={this.state.selectedName === "rect"} 
                    onChange={this.handleChange} />
                <label htmlFor="rect"> Rect </label>
            </div>
        );
    }
}
