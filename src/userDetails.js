import React, { Component } from 'react';
import Loader from 'react-loader-spinner'
import axios from 'axios';

class UserDetails extends Component {
    constructor() {
        super()
        this.state = {
            loading: true,
            user: "",
            logout: false

        }
    }
    
    logoutClick = async () => {
        const alertMsg = await this.logout()
        alert(alertMsg)
        this.setState({logout: true})
    }

    logout = async () => {
        const response = await axios.get('http://localhost:8000/logout')
        return(response.data)
    }

    getUser = async ()  => {
        return axios.get('http://localhost:8000/username')
    }

    async componentDidMount() {
        const user = await this.getUser()
        console.log(user)
        this.setState({
            loading: false,
            user: user.username})
    }

    render() {
        const { loading } = this.state
        if (loading) {
            return <Loader type="Puff" color="#00BFFF" height={150} width={150} />
        }
        return (
                <nav className="navbar">
                    <div
                        className="user"
                        value="username"
                    >
                    username</div>
                    <button
                        className="logout"
                        onClick={this.logoutClick}
                        value="logout"
                    >
                    logout</button>
                </nav>
        );
    }
}

export default UserDetails;