import React from 'react';

export class ToolList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selected: "pen"
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event){
        let toolName = event.target.value;
        this.setState({
            selected: toolName
        });
        this.props.selectTool(toolName);
    }
    render(){
        return (
            <>
                <input type="radio" value="pen" id="pen" 
                    checked={this.state.selected === "pen"} 
                    onChange={this.handleChange} />
                <label htmlFor="pen"> Pen </label>

                <input type="radio" value="rect" id="rect" 
                    checked={this.state.selected === "rect"} 
                    onChange={this.handleChange} />
                <label htmlFor="rect"> Rect </label>
            </>
        );
    }
}
