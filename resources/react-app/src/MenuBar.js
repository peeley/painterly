import React from 'react';

export class MenuBar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            title: props.title
        }
    }
    render(){
        return (
            <div className="row">
                <h3>{this.state.title}</h3>
                <a href="" className="btn btn-light btn-sm" download>Save</a>
            </div>
        );
    }
}
