import React from 'react';

class TitleEditor extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            title: props.title,
            savedTitle: props.title,
            errors: null
        };
    }
    handleChange = (event) => {
        this.setState({
            title: event.target.value
        });
    }
    submitTitle = () => {
        axios.put(`${process.env.MIX_APP_URL}/api/p/${this.props.paintingId}`,
                  {title: this.state.title},
                  {headers: { 'Content-Type': 'application/json'}})
            .then( response => {
                this.setState({
                    savedTitle: this.state.title,
                    errors: null
                });
                this.props.titleChangeCallback(this.state.title);
                $(`#titleModal${this.props.paintingId}`).modal('hide');
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
            <>
                <div className="modal fade" id={"titleModal" + this.props.paintingId} >
                    <div className="modal-dialog" >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Title</h5>
                                <button type="close" className="close" data-dismiss="modal" aria-label="Close">
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body row justify-content-center">
                                <input id={"titleForm_" + this.props.paintingId} className="col-8"
                                    onChange={this.handleChange} type="text" placeholder="Edit title"
                                    value={ this.state.title } />
                                <button id={ this.props.paintingId }
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
            </>
        );
    };
}

export default TitleEditor;
