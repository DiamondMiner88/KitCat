import React from 'react';

// Material-UI
import Link from '@material-ui/core/Link';

// Components
import HomeSidebar from '../components/HomeSidebar';
import NavBar from '../components/Navbar';

export default function Home(props) {
  return (
    <div>
      <NavBar location={props.location} history={props.history} />
      <HomeSidebar />
      <div className="container">
        <h1>Despacito Spider</h1>
        <h2>What is this bot?</h2>
        <p>
          Despacito bot is a bot that can help you manage your server with multiple commands, along
          with a server editor that you can use to edit the bot to what you think is good.
        </p>
        <h2>What can I do?</h2>
        <p>
          There are many things you can do with the bot. Check out the{' '}
          <Link href="/commands">commands</Link> page for more information.
        </p>
      </div>
    </div>
  );
}
