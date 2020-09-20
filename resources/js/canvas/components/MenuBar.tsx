import * as React from 'react';
import axios from 'axios';
import { fabric } from 'fabric';
import { ShareModal } from './ShareModal';
import { SaveModal } from './SaveModal';

type MenuBarProps = {
    title: string,
    paintingId: number,
    surface: fabric.Canvas,
    syncing: boolean,
};

type MenuBarState = {
    title: string,
    titleSyncing: boolean,
    savedTitle: string,
    titleSelected: boolean,
};

export class MenuBar extends React.Component<MenuBarProps, MenuBarState> {
    constructor(props: MenuBarProps) {
        super(props);
        this.state = {
            title: props.title,
            titleSyncing: false,
            savedTitle: props.title,
            titleSelected: false,
        }
    }
    componentDidUpdate(prevProps: MenuBarProps) {
        if (prevProps.title !== this.props.title) {
            this.setState({
                savedTitle: this.props.title,
                title: this.props.title
            });
        }
    }
    handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            title: event.target.value
        });
    }
    postTitle = (event: React.FormEvent<HTMLFormElement>) => {
        this.setState({
            titleSelected: false,
            titleSyncing: true,
        });
        axios.put(`${process.env.MIX_APP_URL}/api/p/${this.props.paintingId}`,
            { title: this.state.title },
            { headers: { 'Content-Type': 'application/json' } })
            .then(() => {
                this.setState({
                    savedTitle: this.state.title,
                    titleSyncing: false,
                });
            })
            .catch(error => {
                if (error.response.status === 422) { // invalid title
                    alert(error.response.data.message);
                    this.setState({
                        title: this.state.savedTitle
                    })
                }
                else if (error.response.status === 401) { // not logged in
                    window.location.replace(`${process.env.MIX_APP_URL}/login`);
                }
                else if (error.response.status === 403) { // do not have edit permissions
                    alert("You do not have permissions to edit this painting's title. ");
                }
            });
        event.preventDefault();
    }
    render() {
        let titleStyle = { color: this.state.titleSyncing ? 'gray' : 'black'};
        return (
            <div className="row pt-3 pb-1">
                <div className="col-auto pt-2">
                    <a href={`${process.env.MIX_APP_URL}/home`}>
                        <i className="fas fa-arrow-left fa-3x"></i>
                    </a>
                </div>
                <div className="col-9">
                    <div className="row">
                        {this.state.titleSelected
                            ? (<form onSubmit={this.postTitle}>
                                <input type="text"
                                    value={this.state.title}
                                    onChange={this.handleTitleChange}
                                    placeholder="Edit Title" />
                                <button type="submit">Save Title </button>
                            </form>)
                            : (<h1 style={titleStyle}
                                onDoubleClick={() => this.setState({ titleSelected: true })}>
                                {this.state.title}
                            </h1>)
                        }
                        <p id="syncing-indicator" className="pl-5">
                            {this.props.syncing ? 'Syncing...' : 'Saved.'}
                        </p>
                    </div>
                    <div className="row">
                        <SaveModal canvas={this.props.surface}
                            title={this.state.title}
                        />
                        <ShareModal />
                    </div>
                </div>
            </div>
        );
    }
}
