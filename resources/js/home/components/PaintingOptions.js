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
                        <button className="dropdown-item" data-toggle="modal"
                            data-target={'#titleModal' + this.props.paintingId}>
                            Edit Title
                        </button>
                        <button className="dropdown-item" data-toggle="modal"
                            data-target={ "#privacyModal" + this.props.paintingId } >
                            Edit Privacy Settings
                        </button>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item">
                            Delete
                        </button>
                    </div>
                </div>
                <TitleEditor paintingId={this.props.paintingId}
                    title={this.props.paintingTitle}
                    titleChangeCallback={this.props.titleChangeCallback}/>
                <PrivacyEditor paintingId={this.props.paintingId}
                    view_public={this.props.view_public}
                    edit_public={this.props.edit_public} />
            </>
        );
    }
}

export default PaintingOptions;
