import React from 'react';

class Painting extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <li className="list-group-item row">
                <a className"col"
                    href={`${process.env.MIX_APP_URL}/painting/${this.props.id}`}>
                    {this.props.title}
                </a>
            </li>
        );
    }
}

export default Painting
