import React from 'react';
import PaintingOptions from './PaintingOptions.js';

class Painting extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <li className="list-group-item row">
                <a className="col"
                    href={`${process.env.MIX_APP_URL}/painting/${this.props.id}`}>
                    {this.props.title}
                </a>
                <PaintingOptions paintingId={this.props.id} />
            </li>
        );
    }
}

export default Painting;
