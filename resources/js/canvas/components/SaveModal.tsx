import * as React from 'react';
import { fabric } from 'fabric';

type SaveModalProps = {
    canvas: fabric.Canvas,
    title: string,
}

type FileType = ".jpeg" | ".png" | ".svg";

type SaveModalState = {
    selectedFileType: FileType,
    imageLink: string,
    filename: string,
}

export class SaveModal extends React.Component<SaveModalProps, SaveModalState> {
    public state: SaveModalState;
    constructor(props: SaveModalProps){
        super(props);
        this.state = {
            selectedFileType: '.jpeg',
            imageLink: '',
            filename: this.props.title,
        };
    }
    componentDidUpdate(prevProps: SaveModalProps){
        if(this.props.title !== prevProps.title){
            this.setState({
                filename: this.props.title
            });
        }
    }
    updateImgLink = () => {
        let imgUrl: string;
        switch(this.state.selectedFileType){
            case '.png':
                imgUrl = this.props.canvas.toDataURL({ format: 'png'});
                break;
            case '.jpeg':
                let bgColor = this.props.canvas.backgroundColor;
                if(!bgColor || bgColor instanceof fabric.Pattern){
                    bgColor = 'rgba(255, 255, 248, 0)';
                }
                let currentBackgroundColor = new fabric.Color(bgColor);
                this.props.canvas.backgroundColor = currentBackgroundColor.toRgb();
                imgUrl = this.props.canvas.toDataURL({ format: 'jpeg'});
                this.props.canvas.backgroundColor = currentBackgroundColor.toRgba();
                break;
            case '.svg':
                const svg = this.props.canvas.toSVG();
                // converting svg to base64 might save space, but will mess up
                // non UTF-16 in any text boxes
                imgUrl = 'data:image/svg+xml,' + svg;
                break;
        }
        console.log(imgUrl);
        this.setState({
            imageLink: imgUrl
        });
    }
    handleFilenameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            filename: event.target.value
        });
    }
    handleFileTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({
            selectedFileType: event.target.value as FileType
        });
    }
    render(){
        return (
            <>
                <button className="btn btn-outline-primary btn-sm" type="button" data-toggle="modal"
                    data-target="#saveModal">
                    Save
                </button>
                <div id="saveModal" className="modal fade">
                    <div className="modal-dialog modal-dialog-centered"
                        role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Save Painting </h3>
                            </div>
                            <div className="modal-body justify-content-center row">
                                <div className="input-group col-6">
                                    <input className="form-control"
                                        value={this.state.filename}
                                        onChange={this.handleFilenameChange} />
                                    <div className="input-group-append">
                                        <select value={this.state.selectedFileType} className="custom-select"
                                            onChange={this.handleFileTypeChange}>
                                            <option value=".jpeg">.jpeg</option>
                                            <option value=".png">.png</option>
                                            <option value=".svg">.svg</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <div className="row">
                                    <div className="pr-3">
                                        <button type="button" className="btn btn-sm btn-outline-secondary"
                                            data-dismiss="modal">
                                            Close
                                        </button>
                                    </div>
                                    <a className="btn btn-primary btn-sm"
                                        onMouseEnter={this.updateImgLink}
                                        href={this.state.imageLink}
                                        download={this.state.filename + this.state.selectedFileType}>
                                        Save
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
