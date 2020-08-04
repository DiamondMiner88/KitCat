import React, { Component } from 'react';
import NavBar from '../components/Navbar';

class _Home extends Component {
  render() {
    return (
      <div>
        <NavBar location={this.props.location} history={this.props.history} />
        <div className="container">
          <p>676284863967526928</p>
        </div>
      </div>
    );
  }
}

export default _Home;
