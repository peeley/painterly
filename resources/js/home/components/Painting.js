import React from 'react';
import PaintingOptions from './PaintingOptions.js';

class Painting extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            title: props.title
        };
    }
    setTitle = (title) => {
        this.setState({
            title: title
        });
    }
    render() {
        return (
            <li className="list-group-item row">
                <a className="col"
                    href={`${process.env.MIX_APP_URL}/painting/${this.props.paintingId}`}>
                    {this.state.title}
                </a>
                <PaintingOptions paintingId={this.props.paintingId}
                    paintingTitle={this.props.title}
                    edit_public={this.props.edit_public}
                    view_public={this.props.view_public}
                    titleChangeCallback={this.setTitle}/>
            </li>
        );
    }
}

export default Painting;
