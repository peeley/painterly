import React from 'react';

export class ShareModal extends React.Component {
    constructor(props){
        super(props);
        this.shareLink = window.location.href;
        this.linkTextArea = React.createRef();
    }
    copyLink = () => {
        this.linkTextArea.current.select();
        document.execCommand('copy');
    }
    render(){
        return (
            <>
                <button type="button" data-toggle="modal" 
                    data-target="#shareModal">
                    Share Link
                </button>
                <div id="shareModal" className="modal fade">
                    <div className="modal-dialog modal-dialog-centered" 
                        role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Share Link</h3>
                            </div>
                            <div className="row modal-body">
                                <input type="text" value={this.shareLink} 
                                    ref={this.linkTextArea} readOnly />
                                <button onClick={this.copyLink}>
                                    Copy
                                </button>
                            </div>
                            <div className="modal-footer">
                                <button type="button" data-dismiss="modal">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
       );
    }
}
