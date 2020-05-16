import React from 'react';
import TitleEditor from './TitleEditor.js';
import PrivacyEditor from './PrivacyEditor.jsx';

class PaintingOptions extends React.Component {
    render(){
        return (
            <>
                <div className="dropdown col">
                    <button className="btn-sm btn-outline-secondary dropdown-toggle"
                        data-toggle="dropdown">
                        ...
                    </button>
                    <div className="dropdown-menu" role="menu" >
                        <TitleEditor paintingId={this.props.paintingId}
                            title={this.props.paintingTitle}
                            titleChangeCallback={this.props.titleChangeCallback}/>
                        <PrivacyEditor paintingId={this.props.paintingId}
                            edit_public={this.props.edit_public}
                            view_public={this.props.view_public} />
                    </div>
                </div>
            </>
        );
    }
}

export default PaintingOptions;
