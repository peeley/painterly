import * as React from 'react';
import axios from 'axios';
import UserPermissionList from './UserPermissionList';

type PrivacyEditorProps = {
    paintingId: number,
    view_public: boolean,
    edit_public: boolean,
}

type PrivacyEditorState = {
    view_public: boolean,
    edit_public: boolean,
    errors: null, // TODO define error type
}

class PrivacyEditor extends React.Component<PrivacyEditorProps, PrivacyEditorState> {
    public state: PrivacyEditorState;
    constructor(props: PrivacyEditorProps){
        super(props);
        this.state = {
            view_public: this.props.view_public,
            edit_public: this.props.edit_public,
            errors: null
        };
    }
    handleViewToggle = () => {
        this.setState({
            view_public: !this.state.view_public
        }, () => {
            if(!this.state.view_public && this.state.edit_public){
                this.setState({
                    edit_public: false
                }, () => this.submitSettings());
            }
            else {
                this.submitSettings();
            }
        });
    }
    handleEditToggle = () => {
        this.setState({
            edit_public: !this.state.edit_public
        }, () => {
            if(!this.state.view_public && this.state.edit_public){
                this.setState({
                    view_public: true
                }, () => this.submitSettings());
            }
            else {
                this.submitSettings();
            }
        });
    }
    submitSettings = () => {
        axios.put(`${process.env.MIX_APP_URL}/api/p/${this.props.paintingId}/perms`,
                  {'view_public': this.state.view_public,
                   'edit_public': this.state.edit_public })
        .catch( error => {
            this.setState({
                errors: error
            })
        });
    }
    render() {
        return (
            <div className="modal fade" role="dialog"
                id={ "privacyModal" + this.props.paintingId }>
                <div className="modal-dialog" role="document" >
                    <div className="modal-content bg-dark text-white">
                        <div className="modal-header" >
                            <h3 className="modal-title" >Edit Privacy Settings</h3>
                            <button className="close text-white" data-dismiss="modal" aria-label="Close">
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body" >
                            <div className="row justify-content-center" >
                                <div className="custom-control custom-switch" >
                                    <input type="checkbox" className="custom-control-input"
                                        id={ "viewPublicSwitch_" + this.props.paintingId }
                                        checked={ this.state.view_public }
                                        onChange={ this.handleViewToggle } />
                                    <label className="custom-control-label"
                                        htmlFor={ "viewPublicSwitch_" + this.props.paintingId }>
                                        Anyone can view
                                    </label>
                                </div>
                            </div>
                            <div className="row justify-content-center" >
                                <div className="custom-control custom-switch" >
                                    <input type="checkbox" className="custom-control-input"
                                        id={ "editPublicSwitch_" + this.props.paintingId }
                                        checked={ this.state.edit_public }
                                        onChange={ this.handleEditToggle } />
                                    <label className="custom-control-label"
                                        htmlFor={ "editPublicSwitch_" + this.props.paintingId }>
                                        Anyone can edit
                                    </label>
                                </div>
                            </div>
                            { !this.state.view_public || ! this.state.edit_public ?
                                <UserPermissionList paintingId={this.props.paintingId} /> : null
                                }
                        </div>
                    </div>
                </div>
                { this.state.errors ?
                    <div className="alert alert-danger alert-dismissable fade show" >
                          {this.state.errors}
                        </div> : null
                    }
            </div>
        );
    }
}

export default PrivacyEditor;
