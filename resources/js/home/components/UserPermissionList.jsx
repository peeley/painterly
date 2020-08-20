import React from 'react';

class UserPermissionList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            permissions: [],
            searchText: "",
            selectedPermission: "read"
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
    handlePermSelect = (event) => {
        this.setState({
            selectedPermission: event.target.value
        });
    }
    addUser = () => {
        axios.post(`${process.env.MIX_APP_URL}/api/p/${this.props.paintingId}/perms`,
                   {'email': this.state.searchText, 'perms': 'read_write'},
                   { headers: {'Content-Type' : 'application/json'}})
        .then( response => {
            this.setState({
                permissions: this.state.permissions.concat([response.data])
            })
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
    permToString = (perm) => {
        if(perm === "read"){
            return "Read"
        }
        else if(perm === "read_write"){
            return "Read & Write"
        }
        else {
            // TODO handle potentially mangled permission strings
            this.setState({
                errors: "Unknown permission given to user."
            });
        }
    }
    render(){
        return (
            <div className="container">
                <h5 className="pl-3 pt-5">User Permissions</h5>
                <div className="justify-content-center input-group mb-3">
                    <input type="text" value={this.state.searchText}
                        onChange={this.handleSearchChange} className="form-control"/>
                    <div className="input-group-append">
                        <select value={this.state.value} className="custom-select" onChange={this.handlePermSelect}>
                            <option value="read">Read</option>
                            <option value="read_write">Read & Write</option>
                        </select>
                        <button className="btn btn-primary"
                            onClick={this.addUser}>
                            Add
                        </button>
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">User</th>
                            <th scope="col">Access</th>
                            <th scope="col">Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                    { this.state.permissions.map( perm => {
                        return (
                            <tr key={perm.id} scope="row">
                                <td>{perm.user_email}</td>
                                <td>{this.permToString(perm.permissions)}</td>
                                <td>
                                    <button className="btn btn-outline-danger btn-sm"
                                        onClick={() => this.removeUser(perm.user_id)}>
                                        &times;
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default UserPermissionList;
