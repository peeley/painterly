import React from 'react';
import axios from 'axios';
import { ShareModal } from './ShareModal.js';

export class MenuBar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            title: props.title,
            titleSelected: false,
            imgLink: ""
        }
    }
    componentDidUpdate(prevProps){
        if(prevProps.title !== this.props.title){
            this.setState({
                title: this.props.title,
            });
        }
    }
    updateImgLink = () => {
        let canvas = this.props.surface.current;
        let imgUrl = canvas.toDataURL('image/jpg');
        this.setState({
            imgLink: imgUrl
        });
    }
    handleTitleChange = (event) => {
        this.setState({
            title: event.target.value
        });
    }
    postTitle = (event) => {
        this.setState({
            titleSelected: false
        });
        axios.put(`${process.env.MIX_APP_URL}/api/p/${this.props.paintingId}`,
            { title: this.state.title },
            { headers: { 'Content-Type' : 'application/json'}})
        .then(response => {
            if(response.status === 401){ // not logged in
                window.location.replace(`${process.env.MIX_APP_URL}/login`);
            }
            else if(response.status === 403){ // not authorized
                alert("You do not have permissions to edit this painting's title. ");
            }
        });
        event.preventDefault();
    }
    render(){
        return (
            <>
                <div className="row">
                    <div className="pr-3">
                    <a href={`${process.env.MIX_APP_URL}/home`}
                        className="btn btn-outline-primary">Home</a>
                    </div>
                    <div>
                        { this.state.titleSelected ?
                            ( <form onSubmit={this.postTitle}>
                                <input type="text" 
                                    value={this.state.title}
                                    onChange={this.handleTitleChange}
                                    placeholder="Edit Title" />
                                <button type="submit">Save Title </button>
                            </form> ) :
                            ( <h3 onDoubleClick={() => this.setState({ titleSelected: true })}>
                                { this.state.title }
                            </h3> )
                        }
                    </div>
                </div>
                <div className="row">
                    <a className="btn btn-outline-primary btn-sm" 
                        onMouseEnter={this.updateImgLink}
                        href={this.state.imgLink} 
                        download={this.state.title}>
                        Save
                    </a>
                    <ShareModal />
                </div>
            </>
        );
    }
}
