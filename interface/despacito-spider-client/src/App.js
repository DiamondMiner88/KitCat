import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

//Material-UI
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

// Pages
import _Home from './pages/_Home';
import _Login from './pages/_Login';
import Guild from './pages/Guild';
import NotFound from './pages/404';

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
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={_Home} />
            <Route exact path="/token" component={_Login} />
            <Route exact path="/guild/:guildID" component={Guild} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
