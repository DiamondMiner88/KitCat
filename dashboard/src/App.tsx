import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

//Material-UI
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import ReactCookieConsent from 'react-cookie-consent';
import { NotFound, Status, Home, Login } from './pages';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#33c9dc',
            main: '#00bcd4',
            dark: '#008394',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff6333',
            main: '#ff3d00',
            dark: '#b22a00',
            contrastText: '#fff',
        },
    },
});

const App = (props: any) => {
    return (
        <MuiThemeProvider theme={theme}>
            <ReactCookieConsent>
                This website uses cookies to enhance the user experience. By continuing to visit this site you agree to
                our use of cookies.
            </ReactCookieConsent>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/about" component={Home} /> 
                    {/* <Route exact path="/commands" component={Commands} /> */}
                    {/* <Route exact path="/guild/:guildID" component={Guild} /> */}
                    {/* <Route exact path="/guilds" component={Guilds} /> */}
                    <Route exact path="/status" component={Status} />
                    <Route exact path="/login" component={Login} />
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        </MuiThemeProvider>
    );
};

export default App;
