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
        axios.put(`http://localhost:8000/api/p/${this.props.paintingId}/title`,
            { title: this.state.title },
            { headers: { 'Content-Type' : 'application/json'}})
        .then(response => {
            if(response.status === 401){ // not logged in
                window.location.replace('http://localhost:8000/login');
            }
            else if(response.status === 403){ // not authorized
                alert("You do not have permissions to edit this painting's title. ");
            }
        });
        event.preventDefault();
    }
    render(){
        return (
            <div className="row">
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
                <a className="btn btn-primary btn-sm" 
                    onMouseEnter={this.updateImgLink}
                    href={this.state.imgLink} 
                    download={this.state.title}>
                    Save
                </a>
                <ShareModal />
            </div>
        );
    }
}
