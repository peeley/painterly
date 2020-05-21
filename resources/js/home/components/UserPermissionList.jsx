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
    render(){
        return (
            <div>
                <h5 className="pl-3">User Permissions</h5>
                <div className="row justify-content-center">
                    <input type="text" value={this.state.searchText}
                        onChange={this.handleSearchChange} />
                    <button className="btn btn-primary btn-sm" onClick={this.addUser}>
                        Add User
                    </button>
                </div>
                <ul className="list-group">
                    { this.state.permissions.map( perm => {
                        return (
                            <li key={perm.id} className="list-group-item row">
                                {JSON.stringify(perm)}
                            </li>
                        );
                    })}
                </ul>
            </div>
        )
    }
}

export default UserPermissionList;
