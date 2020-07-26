import React, { Component } from 'react';
import Link from 'react-router-dom/Link';

//Material UI
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/ToolBar';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

const fetch = require('node-fetch');
class _NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
      avatar: '',
      username: ''
    }
  }

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    if (query.has("token_type") && query.has("access_token")) {
      fetch('/api/users/@me', {
            headers: {
              authorization: `${query.get("token_type")} ${query.get("access_token")}`
            }
          })
          .then(res => res.json())
          .then(json => {
            this.setState({
              isLoggedIn: true,
              avatar: `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}?dynamic=true&size=256`,
              username: json.username
            });
          })
          .catch(console.error);
    }
  }

  componentDidUpdate() {
    const query = new URLSearchParams(this.props.location.search);
    if (!query.has("token_type") && !query.has("access_token")) {
      if (this.state.isLoggedIn) {
        this.setState({
          isLoggedIn: false,
          avatar: undefined,
          username: undefined
        });
      }
    }
  }

  render() {
    const avatar = () => {
      if (this.state.isLoggedIn) return <Avatar alt="profile" src={this.state.avatar} />
      else return <Button color="inherit" href="https://discord.com/api/oauth2/authorize?client_id=713778178967076945&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Ftoken&response_type=code&scope=identify">Login with Discord</Button>
    }
    const username = () => {
      if (this.state.isLoggedIn) return <p>{this.state.username}</p>
    }
    return (
      <AppBar>
        <ToolBar className="nav-container">
          <Button color="inherit" component={Link} to="/">Home</Button>
          {avatar()}
          {username()}
        </ToolBar>
      </AppBar>
    )
  }
}

export default _NavBar;
