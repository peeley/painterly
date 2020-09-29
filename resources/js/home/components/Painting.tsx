import * as React from 'react';
import PaintingOptions from './PaintingOptions';

export type PaintingProps = {
    id: number,
    title: string,
    preview: string,
    edit_public: boolean,
    view_public: boolean,
    deletePaintingCallback: (id: number) => void,
}

type PaintingState = {
    title: string,
}

export class Painting extends React.Component<PaintingProps, PaintingState> {
    public state: PaintingState;
    constructor(props: PaintingProps){
        super(props);
        this.state = {
            title: props.title
        };
    }
    setTitle = (title: string) => {
        this.setState({
            title: title
        });
    }
    render() {
        return (
            <div className="col-4">
                <img className="row painting-preview" height="100%"
                    width="100%" src={this.props.preview} />
                <div className="row">
                    <a
                        href={`${process.env.MIX_APP_URL}/painting/${this.props.id}`}>
                        {this.state.title}
                    </a>
                    <PaintingOptions paintingId={this.props.id}
                        paintingTitle={this.props.title}
                        edit_public={this.props.edit_public}
                        view_public={this.props.view_public}
                        titleChangeCallback={this.setTitle}
                        deletePaintingCallback={this.props.deletePaintingCallback} />
                </div>
            </div>
        );
    }
}
