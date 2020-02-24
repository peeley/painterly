import React from 'react';

export class Palette extends React.Component{
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            color: "#000000"
        }
    }
    handleSubmit(event){
        this.props.updateColor(this.state.color);
        event.preventDefault();
    }
    handleChange(event){
        this.setState({
            color: event.target.value
        });
        event.preventDefault();
    }
    render(){
        return (
            <div>
                <form onSubmit={this.handleSubmit} >
                    <input type="text" onChange={this.handleChange} />
                    <button type="submit">Choose</button>
                </form>
            </div>
        );
    }
}
