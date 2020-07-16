const config = require("../config.json");
const pfx = config.prefix;

module.exports = {
  command: "skick",
  category: "moderation",
  help_name: `:no_entry_sign: Silent kick`,
  help_description: `Used to silently kick members without logging.\n\`${pfx}kick {member} {optional: reason}\``,

  execute(client, message, args) {
    if (!message.member.hasPermission("KICK_MEMBERS")) {
      message.channel.send(`You do not have permission to kick members.`);
      return;
    }
    if (args[0] === undefined) {
      message.channel.send(`You need to mention someone or put their tag.`);
      return;
    }
    let target_user = message.mentions.users.first();
    if (!target_user) {
      let matching_users = client.users.cache.filter(user => user.username === args[0].split("#")[0]);
      target_user = matching_users.find(user => user.discriminator === args[0].split("#")[1]);
      if (!target_user) {
        message.channel.send('Member not found');
        return;
      }
    }
    let target_member = message.guild.members.cache.find(member => member.id === target_user.id);

    args.shift();
    if (args.length === 0) {
      target_member.kick();
    }
    else {
      target_member.ban({
        reason: args.join(" ")
      });
    }
    message.author.send(`You kicked \`${target_member.tag}\`.`);
    message.delete();
  }
}
