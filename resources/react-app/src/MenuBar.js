import React from 'react';

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
    postTitle = () => {
        this.setState({
            titleSelected: false
        });
    }
    copyLink = () => {
        console.log(`share link: ${window.location.href}`);
    }
    render(){
        return (
            <div className="row">
                { this.state.titleSelected ?
                    ( <div>
                        <input type="text" 
                            value={this.state.title}
                            placeholder="Edit Title" />
                        <button onClick={this.postTitle}>Save Title</button>
                    </div> ) :
                    ( <h3 onDoubleClick={() => this.setState({ titleSelected: true })}>
                        {this.state.title}
                    </h3> )
                }
                <a className="btn btn-primary btn-sm" 
                    onMouseEnter={this.updateImgLink}
                    href={this.state.imgLink} 
                    download={`sketch.jpg`}>
                    Save
                </a>
                <button onClick={this.copyLink}>
                    Share Link
                </button>
            </div>
        );
    }
}
