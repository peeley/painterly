import React from 'react';

class PrivacyEditor extends React.Component {
    submitSettings = () => {
        // TODO
    }
    render() {
        return (
            <>
                <div className="modal fade" role="dialog" tabindex="-1"
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
                                            checked={ this.props.view_public } readOnly />
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
                                            checked={ this.props.edit_public } readOnly />
                                        <label className="custom-control-label"
                                            htmlFor={ "editPublicSwitch_" + this.props.paintingId }>
                                            Anyone can edit
                                        </label>
                                    </div>
                                </div>
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
                </div>
            </>
        );
    }
}

export default PrivacyEditor;
