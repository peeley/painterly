import React from 'react';

export class MenuBar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            title: props.title,
            imgLink: ""
        }
    }
    componentDidUpdate(prevProps){
        if(prevProps.title !== this.props.title){
            let canvas = this.props.surface.current;
            let imgUrl = canvas.toDataURL('image/png');
            this.setState({
                title: this.props.title,
                imgLink: imgUrl
            });
        }
    }
    render(){
        return (
            <div className="row">
                <h3>{this.state.title}</h3>
                <a className="btn btn-primary btn-sm" 
                    href={this.state.imgLink} 
                    download={`sketch.png`}>
                    Save
                </a>
            </div>
        );
    }
}
