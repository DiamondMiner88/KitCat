import React from 'react';

// Material-UI
import { Link } from '@material-ui/core';

// Components
import { HomeSidebar, Navbar } from '../components';

export default function Home(props: any) {
    return (
        <div>
            <Navbar {...props} />
            {/* <HomeSidebar /> */}
            <div className="container">
                <h1>KitCat</h1>
                <h2>What is this bot?</h2>
                <p>
                    KitCat is a bot that can help you manage your server with a lot of commands, along with a settings
                    editor that you can use to change server settings to what you think fits.
                </p>
                <h2>What can I do?</h2>
                <p>
                    There are many things you can do with the bot. Check out the{' '}
                    <Link href={'/commands'}>commands</Link> page for more information.
                </p>
            </div>
        </div>
    );
}
