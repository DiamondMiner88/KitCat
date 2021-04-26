import { inspect } from 'util';
import ws from 'ws';

const client = new ws('ws://localhost:9000');

client.on('message', m => console.log(inspect(JSON.parse(m), { depth: null })));
client.on('open', () => {
  client.send(
    JSON.stringify({
      t: 'CHANNELS',
      g: '676284863967526928',
      id: `${Math.random()}`
    })
  );
});
