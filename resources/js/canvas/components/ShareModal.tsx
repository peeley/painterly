import * as React from 'react';

type ShareModalState = {
    copied: boolean
};

export class ShareModal extends React.Component<{}, ShareModalState> {
    private shareLink: string = window.location.href;
    private linkTextArea: React.RefObject<HTMLInputElement> = React.createRef();
    public state: ShareModalState = {
        copied: false
    }
    constructor(props: {}){
        super(props);
    }
    copyLink = () => {
        if(!this.linkTextArea.current){
            return;
        }
        this.linkTextArea.current.select();
        document.execCommand('copy');
        this.setState({
            copied: true
        });
    }
    render(){
        return (
            <>
                <button className="btn btn-outline-primary btn-sm" type="button" data-toggle="modal"
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
                            <div className="modal-body row justify-content-center">
                                <input className="col-8"
                                    type="text" value={this.shareLink}
                                    ref={this.linkTextArea} readOnly />
                                <button className="btn btn-sm btn-outline-primary col-2"
                                    onClick={this.copyLink}>
                                    Copy
                                </button>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-sm btn-outline-secondary"
                                    data-dismiss="modal"
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
