import React from 'react';

class TitleEditor extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            title: props.title,
            savedTitle: props.title,
        };
    }
    render(){
        return (
            <>
                <button className="dropdown-item" data-toggle="modal"
                    data-target={'#titleModal' + this.props.paintingId}>
                    Edit Title
                </button>
                <div className="modal fade" role="dialog" id={"#titleModal" + this.props.paintingId} >
                    <div className="modal-dialog" role="document" >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Title</h5>
                                <button type="close" className="close" data-dismiss="modal" aria-label="Close">
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body row justify-content-center">
                                <input id={"titleForm_" + this.props.paintingId} className="col-8"
                                    type="text" placeholder="Edit title" value={ this.state.title } />
                                <button id={ this.props.paintingId }
                                    className="btn btn-primary editTitleSubmitButton" type="submit">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };
}

export default TitleEditor;
