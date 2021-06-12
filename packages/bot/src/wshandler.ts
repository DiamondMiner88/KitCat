import ws from 'ws';
import { client } from '.';
import { defaultLogger } from './logging';

const server = new ws.Server({ port: 9000 });

server.on('connection', socket => {
  defaultLogger.debug('Connected to backend!');

  socket.on('error', err => defaultLogger.error(`Backend ws error: ${err.message}`));
  socket.on('message', data => handleMessage(socket, data));
});

async function handleMessage(socket: ws, data: ws.Data) {
  if (typeof data !== 'string') return;
  const json = JSON.parse(data);

  if (!client.uptime && json.t !== 'STATUS') return send(socket, { id: json.id, e: 'CLIENT_NOT_READY' });

  switch (json.t) {
    case 'STATUS':
      return send(socket, {
        id: json.id,
        uptime: client.uptime,
        cpu: process.cpuUsage().system,
        memory: process.memoryUsage().rss
      });

    case 'CHANNELS': {
      const guild = client.guilds.cache.get(json.g);
      if (!guild) return send(socket, { id: json.id, e: 'NOT_IN_GUILD' });
      return send(socket, {
        id: json.id,
        data: guild.channels.cache.map(channel => ({
          id: channel.id,
          name: channel.name,
          type_: channel.type,
          perms: channel.permissionOverwrites.map(overwrite => ({
            id: overwrite.id,
            type_: overwrite.type,
            allow: overwrite.allow.bitfield,
            deny: overwrite.deny.bitfield
          }))
        }))
      });
    }

    case 'ROLES': {
      const guild = client.guilds.cache.get(json.g);
      if (!guild) return send(socket, { id: json.id, e: 'NOT_IN_GUILD' });
      return send(socket, {
        id: json.id,
        data: guild.roles.cache
          .filter(role => !role.managed)
          .map(role => ({
            id: role.id,
            name: role.name,
            perms: role.permissions.bitfield,
            pos: role.rawPosition,
            color: role.hexColor
          }))
      });
    }
  }
}

function send(socket: ws, json: Record<string, any>) {
  socket.send(JSON.stringify(json));
}
