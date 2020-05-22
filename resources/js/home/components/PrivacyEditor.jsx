import React from 'react';
import UserPermissionList from './UserPermissionList.jsx';

class PrivacyEditor extends React.Component {
    constructor(props){
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
                });
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
                });
            }
        });
    }
    submitSettings = () => {
        axios.put(`${process.env.MIX_APP_URL}/api/p/${this.props.paintingId}`,
                  {'view_public': this.state.view_public,
                   'edit_public': this.state.edit_public },
                  {'Content-Type': 'application/json'}
        )
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
                    <div className="modal-content" >
                        <div className="modal-header" >
                            <h5 className="modal-title" >Edit Privacy Settings</h5>
                            <button type="close" className="close" data-dismiss="modal" aria-label="Close">
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
                        <div className="modal-footer" >
                            <button className="btn btn-primary"
                                onClick={ this.submitSettings }
                                data-dismiss="modal">
                                Submit
                            </button>
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
