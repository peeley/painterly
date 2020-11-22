import * as React from 'react';
import axios from 'axios';

type TitleEditorProps = {
    paintingId: number,
    title: string,
    titleChangeCallback: (title: string) => void,
}

type TitleEditorState = {
    title: string,
    savedTitle: string,
    errors: any, // TODO define error type
}

class TitleEditor extends React.Component<TitleEditorProps, TitleEditorState> {
    public state: TitleEditorState;
    constructor(props: TitleEditorProps){
        super(props);
        this.state = {
            title: props.title,
            savedTitle: props.title,
            errors: null
        };
    }
    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            title: event.target.value
        });
    }
    submitTitle = () => {
        axios.put(`${process.env.MIX_APP_URL}/api/p/${this.props.paintingId}`,
                  {title: this.state.title},
                  {headers: { 'Content-Type': 'application/json'}})
            .then( _ => {
                this.setState({
                    savedTitle: this.state.title,
                    errors: null
                });
                this.props.titleChangeCallback(this.state.title);
                let titleModal = $(`#titleModal${this.props.paintingId}`);
                if(titleModal){
                    titleModal.modal('hide');
                }
            })
            .catch( error => {
                console.log(error);
                this.setState({
                    errors: error.response.data.errors.title[0]
                });
            });
    }
    render(){
        return (
            <div className="modal fade" id={"titleModal" + this.props.paintingId} >
                <div className="modal-dialog" >
                    <div className="modal-content bg-dark text-white">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Title</h5>
                            <button className="close text-white" data-dismiss="modal" aria-label="Close">
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body row justify-content-center">
                            <input id={"titleForm_" + this.props.paintingId} className="col-8"
                                onChange={this.handleChange} type="text" placeholder="Edit title"
                                value={ this.state.title } />
                            <button id={ `${this.props.paintingId}` }
                                className="btn btn-primary editTitleSubmitButton"
                                onClick={this.submitTitle}>
                                Submit
                            </button>
                        </div>
                    </div>
                    { this.state.errors ?
                        <div className="alert alert-danger alert-dismissable fade show" >
                            {this.state.errors}
                        </div> : null
                    }
                </div>
            </div>
        );
    };
}

export default TitleEditor;
