import React, { Component } from 'react';
import NavBar from '../components/_Navbar';

class _Home extends Component {
  render() {
    return (
      <div>
        <NavBar location={this.props.location}/>
        <div className="container">
          <p>Add stuff here</p>
        </div>
      </div>
    )
  }
}

export default _Home;
