import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/ToolBar';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const fetch = require('node-fetch');

class _NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: undefined,
      avatarUrl: undefined
    };
  }

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    if (query.has('token_type') && query.has('access_token')) {
      fetch('/api/users/@me', {
        headers: {
          authorization: `${query.get('token_type')} ${query.get('access_token')}`
        }
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.message) this.props.history.push(`/`);
          else
            this.setState({
              user: json,
              avatarUrl: `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}?dynamic=true&size=256`
            });
        })
        .catch(console.error);
    }
  }

  componentDidUpdate() {
    const query = new URLSearchParams(this.props.location.search);
    if (!query.has('token_type') && !query.has('access_token')) {
      if (this.state.user) {
        this.setState({
          user: undefined,
          avatar: undefined
        });
      }
    }
  }

  render() {
    return (
      <AppBar>
        <ToolBar>
          <Button
            color="inherit"
            href="https://discord.com/api/oauth2/authorize?client_id=713778178967076945&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Ftoken&response_type=code&scope=identify"
          >
            Login
          </Button>
          {this.state.user ? (
            <Typography className="element right" variant="button">
              {this.state.user.username}#{this.state.user.discriminator}
            </Typography>
          ) : null}
          {this.state.user ? (
            <Avatar className="element right" alt="profile" src={this.state.avatarUrl} />
          ) : null}
        </ToolBar>
      </AppBar>
    );
  }
}

export default _NavBar;
