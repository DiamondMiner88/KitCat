import { Channel, TextChannel } from 'discord.js';
import { Request, Response } from 'express';
import { bot } from '../bot';

export default async function (request: Request, response: Response) {
  const { username, action, channel } = request.body;
  if (!username || !action) return response.status(400).send('');

  let chnl: Channel;
  try {
    chnl = await bot.channels.fetch(channel);
    if (!channel) throw Error;
  } catch (error) {
    return response.status(400).send('');
  }

  (chnl as TextChannel).send(`${username} has ${action}.`);
  response.send('');
}
