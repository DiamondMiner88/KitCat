import React, { Component } from 'react';

// Components
import NavBar from '../components/Navbar';

class _Home extends Component {
  render() {
    return (
      <div>
        <NavBar location={this.props.location} history={this.props.history} />
        <div className="container">
          <br />
          <a href="/guilds">Guilds list</a>
        </div>
      </div>
    );
  }
}

export default _Home;
