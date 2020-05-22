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
        // TODO call to API to add user permission
    }
    removeUser = () => {
        // TODO call to API to remove user permission
    }
    render(){
        return (
            <div className="container">
                <h3 className="pl-3">User Permissions</h3>
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
                                    onClick={this.removeUser}>
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
