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
            this.setState({
                title: this.props.title,
            });
        }
    }
    updateImgLink = () => {
        let canvas = this.props.surface.current;
        let imgUrl = canvas.toDataURL('image/jpg');
        this.setState({
            imgLink: imgUrl
        });
    }
    render(){
        return (
            <div className="row">
                <h3>{this.state.title}</h3>
                <a className="btn btn-primary btn-sm" 
                    onMouseEnter={this.updateImgLink}
                    href={this.state.imgLink} 
                    download={`sketch.jpg`}>
                    Save
                </a>
            </div>
        );
    }
}
