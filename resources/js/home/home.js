import React from 'react';
import ReactDOM from 'react-dom';
import Painting from './components/Painting.js';

let userId = $('#root').attr('userId');

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            paintings: [ ]
        }
    }
    componentDidMount(){
        axios.get(`${process.env.MIX_APP_URL}/api/u/${this.props.userId}/paintings`)
        .then( response => {
            this.setState({
                paintings: response.data
            });
        })
    }
    deletePainting = (paintingId) => {
        this.setState({
            paintings: this.state.paintings.filter(p => p.id !== paintingId)
        });
    }
    createPainting = () => {
        axios.post(`${process.env.MIX_APP_URL}/api/p`)
        .then( response => {
            this.setState({
                paintings: this.state.paintings.concat([response.data])
            });
        })
        .catch( error => {
            console.log(error);
            // TODO: error handling
        })
    }
    render(){
        return (
            <>
                <div className="row py-3" >
                    <h3 className="col-6">My Paintings</h3>
                    <button className="btn btn-sm btn-success" onClick={this.createPainting}>
                        Create New Painting
                    </button>
                </div>
                <ul className="list-group list-group-flush">
                { this.state.paintings.map(painting => {
                    return (
                        <Painting title={painting.title}
                            paintingId={painting.id}
                            edit_public={painting.edit_public}
                            view_public={painting.view_public}
                            key={painting.id}
                            deletePaintingCallback={this.deletePainting} />
                    );
                })}
                </ul>
            </>
        );
    }
}

ReactDOM.render(<Home userId={userId}/>, document.getElementById('root'));
