import * as React from 'react';
import axios from 'axios';
import { ShareModal } from './ShareModal';

type MenuBarProps = {
    title: string,
    paintingId: number,
    surface: React.RefObject<HTMLCanvasElement>
};

type MenuBarState = {
    title: string,
    savedTitle: string,
    titleSelected: boolean,
    imgLink: string
};

export class MenuBar extends React.Component<MenuBarProps, MenuBarState> {
    constructor(props: MenuBarProps){
        super(props);
        this.state = {
            title: props.title,
            savedTitle: props.title,
            titleSelected: false,
            imgLink: ""
        }
    }
    componentDidUpdate(prevProps: MenuBarProps){
        if(prevProps.title !== this.props.title){
            this.setState({
                savedTitle: this.props.title,
                title: this.props.title
            });
        }
    }
    updateImgLink = () => {
        let canvas = this.props.surface.current;
        if(!canvas){
            return;
        }
        let imgUrl = canvas.toDataURL('image/jpg');
        this.setState({
            imgLink: imgUrl
        });
    }
    handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            title: event.target.value
        });
    }
    postTitle = (event: React.FormEvent<HTMLFormElement>) => {
        this.setState({
            titleSelected: false
        });
        axios.put(`${process.env.MIX_APP_URL}/api/p/${this.props.paintingId}`,
            { title: this.state.title },
            { headers: { 'Content-Type' : 'application/json'}})
        .then( () => {
            this.setState({
                savedTitle: this.state.title
            });
        })
        .catch( error => {
            if(error.response.status === 422){ // invalid title
                alert(error.response.data.message);
                this.setState({
                    title: this.state.savedTitle
                })
            }
            else if(error.response.status === 401){ // not logged in
                window.location.replace(`${process.env.MIX_APP_URL}/login`);
            }
            else if(error.response.status === 403){ // do not have edit permissions
                alert("You do not have permissions to edit this painting's title. ");
            }
        });
        event.preventDefault();
    }
    render(){
        return (
            <>
                <div className="row pt-3">
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
                                { this.state.savedTitle }
                            </h3> )
                        }
                    </div>
                </div>
                <div className="row">
                    <a className="btn btn-outline-primary btn-sm"
                        onMouseEnter={this.updateImgLink}
                        href={this.state.imgLink}
                        download={this.state.savedTitle}>
                        Save
                    </a>
                    <ShareModal />
                </div>
            </>
        );
    }
}
