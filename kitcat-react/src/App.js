import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

//Material-UI
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import { Commands, Guild, Guilds, Home, NotFound, Status, CookiePolicy } from './pages';
import './App.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#33c9dc',
      main: '#00bcd4',
      dark: '#008394',
      contrastText: '#fff'
    },
    secondary: {
      light: '#ff6333',
      main: '#ff3d00',
      dark: '#b22a00',
      contrastText: '#fff'
    }
  }
});

function App(props) {
  return (
    <MuiThemeProvider theme={theme}>
      <HashRouter basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/commands" component={Commands} />
          <Route exact path="/cookies" component={CookiePolicy} />
          <Route exact path="/guild/:guildID" component={Guild} />
          <Route exact path="/guilds" component={Guilds} />
          <Route exact path="/status" component={Status} />
          <Route component={NotFound} />
        </Switch>
      </HashRouter>
    </MuiThemeProvider>
  );
}

export default App;
