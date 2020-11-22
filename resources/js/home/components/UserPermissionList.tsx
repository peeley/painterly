import React from 'react';
import axios from 'axios';

type PermissionListProps = {
    paintingId: number,
}

type PermissionListState = {
    permissions: Array<any> // TODO define type to permission
    searchText: string,
    value: "read"|"read_write",
    errors: string, // TODO define error type too
}

class UserPermissionList extends React.Component<PermissionListProps, PermissionListState> {
    public state: PermissionListState;
    constructor(props: PermissionListProps){
        super(props);
        this.state = {
            permissions: [],
            searchText: "",
            value: "read",
            errors: "",
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
    handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            searchText: event.target.value
        });
        // TODO interactive search, usernames pop up
    }
    handlePermSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let selected = event.target.value;
        if(selected === "read" || selected === "read_write"){
            this.setState({
                value: selected,
            });
        }
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
    removeUser = (userId: number) => {
        axios.delete(`${process.env.MIX_APP_URL}/api/p/${this.props.paintingId}/perms/${userId}`)
        .then( _ => {
            this.setState({
                permissions: this.state.permissions.filter( p => p.user_id !== userId)
            });
        })
        .then( error => {
            console.log(error);
            // TODO error handling
        });
    }
    permToString = (perm: string) => {
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
                <h5 className="pl-3 pt-5">Allowed Users</h5>
                <div className="justify-content-center input-group mb-3">
                    <input type="text" placeholder="Add user by email..." value={this.state.searchText}
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
                <table className="table bg-dark text-white">
                    <thead>
                        <tr>
                            <th scope="col">User</th>
                            <th scope="col">Permissions</th>
                            <th scope="col">Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                    { this.state.permissions.map( perm => {
                        return (
                            <tr key={perm.id}>
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
