import React from 'react';

// Components
import NavBar from '../components/Navbar';
import Sidebar from '../components/GuildSidebar';
import { Link } from '@material-ui/core';

function Home(props) {
  return (
    <div>
      <NavBar location={props.location} history={props.history} />
      <Sidebar />
      <div className="container">
        <h1>Despacito Spider</h1>
        <h2>What is this bot?</h2>
        <p>
          Despacito bot is a bot that can help you manage your server with multiple commands, along with a server editor that you
          can use to edit the bot to what you think is good.
        </p>
        <h2>What can I do?</h2>
        <p>
          There are many things you can do with the bot. Check out the <Link href="/commands">commands</Link> page for more information.
        </p>
      </div>
    </div>
  );
}

export default Home;
