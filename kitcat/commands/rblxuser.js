const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    command: 'rblxuser',
    category: require('./_CATEGORIES.js').utils,
    help_name: `Roblox User`,
    help_description: `Search for a roblox user.`,
    usage: `rblxuser {username}`,
    guildOnly: false,
    unlisted: false,

    execute(message, args) {
        if (args[0] === 0) {
            return message.channel.send("You didn't provide a Roblox username.");
        }
        fetch(`https://api.roblox.com/users/get-by-username?username=${args[0]}`)
            .then(res => res.json())
            .then(userBody => {
                if (userBody['success'] === false) { // It could be undefined, so specifying that it has to be false
                    return message.channel.send(`Invalid user: ${args[0]}`);
                }
                fetch(`https://api.roblox.com/users/${userBody["Id"]}/groups`)
                    .then(res => res.json())
                    .then(groupsBody => {
                        var rblxEmbed = new Discord.MessageEmbed()
                            .setTitle(`User "${args[0]}"`)
                            .addField("Online", userBody['IsOnline'], true)
                            .addField("ID", userBody['Id'], true)
                            .setColor("#c4281c")
                            .setImage(`http://www.roblox.com/Thumbs/Avatar.ashx?x=150&y=150&Format=Png&username=${args[0]}`);
                        var groups = groupsBody.map((item) => 
                                        `Name: *[${item["Name"]}](https://www.roblox.com/groups/${item["Id"]})* Role: ${item["Role"]}`
                                    ).join("\n");
                        rblxEmbed.addField("Groups", groups);
                        return message.channel.send(rblxEmbed);
                    }).catch((err => {console.log(err)}));
            });
    }
};
