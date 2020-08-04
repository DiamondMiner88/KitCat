import React, { Component } from 'react';
import NavBar from '../components/Navbar';

class _Home extends Component {
  render() {
    return (
      <div>
        <NavBar location={this.props.location} history={this.props.history} />
        <div className="container">
          <a href="/guild/676284863967526928">Bot testing server (ID: 676284863967526928)</a>
          <br />
          <a href="/guilds">Guilds list</a>
        </div>
      </div>
    );
  }
}

export default _Home;
