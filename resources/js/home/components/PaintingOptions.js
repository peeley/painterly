import React from 'react';
import TitleEditor from './TitleEditor.js';

class PaintingOptions extends React.Component {
    render(){
        return (
            <>
                <div className="dropdown col">
                    <button className="btn-sm btn-outline-secondary dropdown-toggle"
                        data-toggle="dropdown">
                        ...
                    </button>
                    <TitleEditor paintingId={this.props.paintingId} title={this.props.paintingTitle}/>
                </div>
            </>
        );
    }
}

export default PaintingOptions;
