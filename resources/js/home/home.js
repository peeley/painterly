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
    render(){
        return (
            <>
                <div className="row py-3" >
                    <h3 className="col-6">My Paintings</h3>
                    <form method="POST" action="/painting">
                        <button className="btn btn-sm btn-success col" type="submit">
                            Create New Painting
                        </button>
                    </form>
                </div>
                <ul className="list-group list-group-flush">
                { this.state.paintings.map(painting => {
                    return (
                        <Painting title={painting.title}
                            paintingId={painting.id}
                            edit_public={painting.edit_public}
                            view_public={painting.view_public}
                            key={painting.id} />
                    );
                })}
                </ul>
            </>
        );
    }
}

ReactDOM.render(<Home userId={userId}/>, document.getElementById('root'));
