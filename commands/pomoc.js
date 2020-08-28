const Discord = require('discord.js');
const { prefix } = require('../config.json');
module.exports = {
	name: 'pomoc',
	description: 'Wyświetla dostępne komendy',
	execute(message, args) {
        const pomocEmbed = new Discord.MessageEmbed()
	        .setTitle('Dostępne komendy:')
            .setColor('#7289da');
        
        const iterator = message.client.commands.values();
        for (const item of iterator) {
            pomocEmbed.addField(prefix + item.name, item.description, true);
        }

        message.channel.send(pomocEmbed);
    },
};