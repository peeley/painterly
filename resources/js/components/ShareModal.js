import React from 'react';

export class ShareModal extends React.Component {
    constructor(props){
        super(props);
        this.shareLink = window.location.href;
        this.linkTextArea = React.createRef();
        this.state = {
            copied: false
        };
    }
    copyLink = () => {
        this.linkTextArea.current.select();
        document.execCommand('copy');
        this.setState({
            copied: true
        });
    }
    render(){
        return (
            <>
                <button type="button" data-toggle="modal" 
                    data-target="#shareModal">
                    Share Link
                </button>
                <div id="shareModal" className="modal fade">
                    <div className="modal-dialog" 
                        role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Share Link</h3>
                            </div>
                            <div className="row modal-body">
                                <input className="col-9" 
                                    type="text" value={this.shareLink} 
                                    ref={this.linkTextArea} readOnly />
                                <button className="col-3" 
                                    onClick={this.copyLink}>
                                    Copy
                                </button>
                            </div>
                            <div className="modal-footer">
                                <button type="button" data-dismiss="modal"
                                    onClick={() => this.setState({ copied: false})} >
                                    Close
                                </button>
                            </div>
                        </div>
                        { this.state.copied ? (
                            <div className="alert alert-success alert-dismissable fade show" role="alert">
                                Copied to clipboard!
                            </div>
                        ) : '' }
                    </div>
                </div>
            </>
       );
    }
}
