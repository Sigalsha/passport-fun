import React, { Component } from 'react';
import './App.css';
import UserDetails from './userDetails'
import axios from 'axios';



class App extends Component {
  constructor() {
    super()
    this.state = {
        user: "",
    }
}


  componentDidMount = async () => {
    const res = await axios.get('http://localhost:8000/login')
    console.log(res)
    this.setState({
      user: res.user
    })
  }

  render() {
    return (
      <div className="App">
        <div className="nav"><UserDetails /></div>
        hello
      </div>
    );
  }
}

export default App;
