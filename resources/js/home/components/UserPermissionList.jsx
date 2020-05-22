import React from 'react';

class UserPermissionList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            permissions: [],
            searchText: ""
        };
    }
    componentDidMount(){
        axios.get(`${process.env.MIX_APP_URL}/api/p/${this.props.paintingId}/perms`)
        .then( response => {
            this.setState({
                permissions: response.data
            });
        })
        .catch( error => {
            console.log(error);
        });
    }
    handleSearchChange = (event) => {
        this.setState({
            searchText: event.target.value
        });
        // TODO interactive search, usernames pop up
    }
    addUser = () => {
        axios.post(`${process.env.MIX_APP_URL}/api/p/${this.props.paintingId}/perms`,
                   null,
                   { params: {'email': this.state.searchText, 'perms': 'read_write'}})
        .then( response => {
            console.log(response);
        })
        .catch( error => {
            console.log(error);
            // TODO error handling
        })
    }
    removeUser = (userId) => {
        axios.delete(`${process.env.MIX_APP_URL}/api/p/${this.props.paintingId}/perms/${userId}`)
             .then( response => {
                 this.setState({
                     permissions: this.state.permissions.filter( p => p.user_id !== userId)
                 });
             })
             .then( error => {
                 console.log(error);
                 // TODO error handling
             });
    }
    render(){
        return (
            <div className="container">
                <h5 className="pl-3">User Permissions</h5>
                <div className="row justify-content-center">
                    <input type="text" value={this.state.searchText}
                        onChange={this.handleSearchChange} />
                    <button className="btn btn-primary btn-sm" onClick={this.addUser}>
                        Add User
                    </button>
                </div>
                <ul className="list-group list-group-flush">
                    { this.state.permissions.map( perm => {
                        return (
                            <li key={perm.id} className="list-group-item">
                                <span className="col-5">{perm.user_email}</span>
                                <span className="col-7">{perm.permissions}</span>
                                <button className="btn btn-outline-danger btn-sm"
                                    onClick={() => this.removeUser(perm.user_id)}>
                                    &times;
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        )
    }
}

export default UserPermissionList;
