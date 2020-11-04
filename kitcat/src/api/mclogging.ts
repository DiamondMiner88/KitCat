import { TextChannel } from 'discord.js';
import { Request, Response } from 'express';
import { bot } from '../bot';

export default async function (request: Request, response: Response) {
  const { username, action, channel } = request.body;
  if (!username || !action) return response.status(400);

  const chnl = await bot.channels.fetch(channel);
  if (!channel) return response.status(404);
  (chnl as TextChannel).send(`${username} has ${action}.`);
}
