import React, { useEffect } from 'react';
import Cookies from 'universal-cookie';
import fetch from 'node-fetch';

export default function Login(props: any) {
    // React.useEffect(() => {
    //     const cookies = new Cookies();

    //     const code = /\?code=(.{30})/.exec(window.location.href);

    //     if (window.location.href.includes('?error=')) window.location = process.env.PUBLIC_URL + '#/';
    //     else if (window.location.href.includes('?code=')) {
    //         fetch(`https://parseapi.back4app.com/functions/getAccessToken`, {
    //             method: 'POST',
    //             body: JSON.stringify({
    //                 code: code[1],
    //                 'url-redirect': process.env.REACT_APP_DISCORD_REDIRECT_URL,
    //             }),
    //         })
    //             .then((res) => res.json())
    //             .then((json) => {
    //                 console.log(json);
    //                 if (json.result.access_token)
    //                     cookies.set('access-token', json.result.access_token, {
    //                         path: '/',
    //                         maxAge: 604000,
    //                         sameSite: 'strict',
    //                         overwrite: true,
    //                         secure: true,
    //                     });
    //                 window.location = process.env.PUBLIC_URL + '#/';
    //             })
    //             .catch((error) => console.error(error));
    //     }
    // }, [props.location]);
    return null;
}
