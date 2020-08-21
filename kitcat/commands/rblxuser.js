const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    command: 'rblxuser',
    category: require('./_CATEGORIES.js').utils,
    help_name: `Roblox User`,
    help_description: `Get Roblox profile, checks if user is online, gets id, and shows groups the user is in.`,
    usage: `rblxuser {username}`,
    guildOnly: false,
    unlisted: false,

  /**
   * 
   * @param {Discord.TextChannel} message
   * @param {Array.<String>} args
   */
    async execute(message, args) {
        if (args[0] === 0) {
            return message.channel.send("You didn't provide a Roblox username.");
        }

        const userRes = await fetch(`https://api.roblox.com/users/get-by-username?username=${args[0]}`);
        const userBody = await userRes.json();

        const groupRes = await fetch(`https://api.roblox.com/users/${userBody["Id"]}/groups`);
        const groupsBody = await groupRes.json();

        if (userBody['success'] === false) { // It could be undefined, so specifying that it has to be false
            return message.channel.send(`Invalid user: ${args[0]}`);
        }

        var rblxEmbed = new Discord.MessageEmbed()
            .setTitle(`User "${args[0]}"`)
            .addField("Online", userBody['IsOnline'], true)
            .setDescription(`[Roblox Profile](https://www.roblox.com/users/${userBody['Id']})`)
            .addField("ID", userBody['Id'], true)
            .setColor("#c4281c")
            .setImage(`http://www.roblox.com/Thumbs/Avatar.ashx?x=150&y=150&Format=Png&username=${args[0]}`);
        
        var groups = groupsBody.map((item) => {
                            return `Name: *[${item["Name"]}](https://www.roblox.com/groups/${item["Id"]})*    Role: *${item["Role"]}*`;
                        }
                    );
        
        var strGroups = groups.join("\n");

        if (strGroups.length >= 1024) {
            while (strGroups.length >= 1018) {
                groups.pop();
                strGroups = groups.join("\n");
            }
            strGroups += "...";
        }

        rblxEmbed.addField("Groups", strGroups);
        
        return message.channel.send(rblxEmbed);
    }
};
