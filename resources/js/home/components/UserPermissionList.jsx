import React from 'react';

class UserPermissionList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            permissions: []
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
    render(){
        return (
            <>
                <h5>User Permissions</h5>
                <ul className="list-group">
                    { this.state.permissions.map( perm => {
                        <li className="list-group-item row">{perm}</li>
                    })}
                </ul>
            </>
        )
    }
}

export default UserPermissionList;
