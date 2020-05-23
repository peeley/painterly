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
                   null,
                   { params: {'email': this.state.searchText, 'perms': 'read_write'}})
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
    render(){
        return (
            <div className="container">
                <h5 className="pl-3">User Permissions</h5>
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
