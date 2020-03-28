import React from 'react';
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
    postTitle = () => {
        this.setState({
            titleSelected: false
        });
        // make POST to backend to update title, update browser page title
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
                        <input type="submit" value="Save Title" />
                    </form> ) :
                    ( <h3 onDoubleClick={() => this.setState({ titleSelected: true })}>
                        {this.state.title}
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
