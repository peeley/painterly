import * as React from 'react';
import * as ReactDOM from 'react-dom';
import axios from 'axios';
import { Painting, PaintingProps } from './components/Painting';

type HomeProps = {
    userId: number
}

type HomeState = {
    paintings: Array<any> // TODO define type for painting JSON
}

class Home extends React.Component<HomeProps, HomeState> {
    public state: HomeState;
    constructor(props: HomeProps) {
        super(props);
        this.state = {
            paintings: []
        }
    }
    componentDidMount() {
        axios.get(`${process.env.MIX_APP_URL}/api/u/${this.props.userId}/paintings`)
            .then(response => {
                this.setState({
                    paintings: response.data
                });
            })
    }
    deletePainting = (paintingId: number) => {
        this.setState({
            paintings: this.state.paintings.filter(p => p.id !== paintingId)
        });
    }
    createPainting = () => {
        axios.post(`${process.env.MIX_APP_URL}/api/p`)
            .then(response => {
                const paintingId = response.data.id;
                window.location.replace(`${process.env.MIX_APP_URL}/painting/${paintingId}`);
            })
            .catch(error => {
                console.log(error);
                // TODO: error handling
            })
    }
    render() {
        return (
            <>
                <div className="row py-3" >
                    <h3 className="col-6">My Paintings</h3>
                    <button className="btn btn-sm btn-success" onClick={this.createPainting}>
                        Create New Painting
                    </button>
                </div>
                <div className="row pb-5 pl-4">
                    {this.state.paintings.map((painting: PaintingProps) => {
                        return (
                            <Painting title={painting.title}
                                id={painting.id}
                                edit_public={painting.edit_public}
                                view_public={painting.view_public}
                                key={painting.id}
                                preview={painting.preview}
                                deletePaintingCallback={this.deletePainting} />
                        );
                    })}
                </div>
            </>
        );
    }
}

const idTag = $('#root').attr('userId');
const userId: number = idTag ? +idTag : -1;
ReactDOM.render(React.createElement(Home, {'userId': userId}), document.getElementById('root'));
