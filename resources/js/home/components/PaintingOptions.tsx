import * as React from 'react';
import axios from 'axios';
import TitleEditor from './TitleEditor';
import PrivacyEditor from './PrivacyEditor';

type OptionsProps = {
    paintingId: number,
    paintingTitle: string,
    edit_public: boolean,
    view_public: boolean,
    titleChangeCallback: (title: string) => void,
    deletePaintingCallback: (id: number) => void,
}

type OptionsState = {}

class PaintingOptions extends React.Component<OptionsProps, OptionsState> {
    handleDelete = () => {
        if(confirm(`Really delete painting '${this.props.paintingTitle}'?`)){
            axios.delete(`${process.env.MIX_APP_URL}/api/p/${this.props.paintingId}`)
            .then( _ => {
                this.props.deletePaintingCallback(this.props.paintingId);
            })
            .catch( error => {
                console.log(error);
                // TODO: error handling
            });
        }
    }
    render(){
        return (
            <>
                <div className="dropdown col">
                    <span className="btn-sm btn-outline-secondary dropdown-toggle"
                        data-toggle="dropdown">
                        ...
                    </span>
                    <div className="dropdown-menu bg-dark text-white" role="menu" >
                        <button className="dropdown-item bg-dark text-white" data-toggle="modal"
                            data-target={'#titleModal' + this.props.paintingId}>
                            Edit Title
                        </button>
                        <button className="dropdown-item bg-dark text-white" data-toggle="modal"
                            data-target={ "#privacyModal" + this.props.paintingId } >
                            Edit Privacy Settings
                        </button>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item bg-dark text-danger" onClick={this.handleDelete}>
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
