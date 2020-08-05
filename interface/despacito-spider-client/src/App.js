import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

//Material-UI
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

// Pages
import Guild from './pages/Guild';
import Guilds from './pages/Guilds';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Token from './pages/Token';

// Other
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
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/token" component={Token} />
          <Route exact path="/guild/:guildID" component={Guild} />
          <Route exact path="/guilds" component={Guilds} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
