const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, guildID, roles, roles4Fun, defaultColor, classRoleChannelID, classRoleMessageID, funRoleChannelID, funRoleMessageID } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('shardReady', () => {
	console.log('Bot pomyslnie wystartowal!');
	client.user.setActivity(prefix+'pomoc', { type: 'LISTENING' });

	const channelClassRole = client.channels.cache.get(classRoleChannelID);
	channelClassRole.messages.fetch(classRoleMessageID)
		.then(message => message.react('👍'))
		.catch(console.error);
	const channel4funRole = client.channels.cache.get(funRoleChannelID);
	channel4funRole.messages.fetch(funRoleMessageID)
		.then(message => message.react('👍'))
		.catch(console.error);

	const welcomeClassRoleChannelEmbed = new Discord.MessageEmbed()
    .setColor(defaultColor)
    .setTitle('Odbierz rangę klasową')
	.setDescription('Zareaguj 👍 na tę wiadomość, a następnie sprawdź swoje DMy.')
	const welcome4funRoleChannelEmbed = new Discord.MessageEmbed()
    .setColor(defaultColor)
    .setTitle('Odbierz rangę 4FUN')
    .setDescription('Zareaguj 👍 na tę wiadomość, a następnie sprawdź swoje DMy.')
	//channelClassRole.send(welcomeClassRoleChannelEmbed);
	//channel4funRole.send(welcome4funRoleChannelEmbed);
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    if (!client.commands.has(command)){
		message.reply('Nie znam tej komendy, wpisz `+pomoc`, aby zobaczyć listę komend.');
		return;
	}

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Coś poszło nie tak 😢 ', error);
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
	if(user.bot) return;

	if (reaction.partial) {
		try {
			await reaction.fetch();
		}
		catch (error) {
			console.log('Coś poszło nie tak 😢 ', error);
			return;
		}
	}
	if(reaction.message.id == classRoleMessageID) {
		if (reaction.emoji.name === '👍') {
			reaction.users.remove(user.id);
			console.log(`${user.tag} zareagował na dodanie rangi!`);
            const myuser = client.users.cache.get(user.id);
            const roleWelcomeEmbed = new Discord.MessageEmbed()
	        .setColor(defaultColor)
            .setTitle('Ranga klasowa')
            .addField('Dostępne klasy:', roles.map((e) => `\`${e}\``).join(', '), true)
	        .setDescription('Aby ustawić rangę napisz swoją klase');
			const msg = await myuser.send(roleWelcomeEmbed);
			const filter = collected => collected.author.id === user.id;
			const collected = await msg.channel.awaitMessages(filter, {
				max: 1,
                time: 50000,
                errors: ['time']
			}).catch(collected => {
                myuser.send('Nie udzieliłeś odpowiedzi 😢');
            });

            if(!collected) return;

			if(collected.first().content === 'anuluj') return myuser.send('Anulowano!');

			const roleName = roles.find((e) => e.toLowerCase() === collected.first().content.toLowerCase());
			if (!roleName) {
				const availableRolesString = roles.map((e) => `\`${e}\``).join(', ');
				myuser.send(`Nieznana rola \`${collected.first().content.toLowerCase()}\`\nDostępne role: ${availableRolesString}`);
			}else{
				const ranga = reaction.message.guild.roles.cache.find(role => role.name === roleName);
				if(!ranga) return myuser.send('Błąd: `Nie znaleziono roli na serwerze`');
				const guild = client.guilds.cache.get(guildID);
				const member = guild.members.cache.get(user.id);
				member.roles.add(ranga).then(function() {
					myuser.send(`Pomyślnie nadano range **${ranga.name}**`);
					console.log('Ranga', ranga.name, 'została dodana', member.user.username, 'na serwerze', guild.name);
					client.channels.cache.get(classRoleChannelID).updateOverwrite(member.user, { VIEW_CHANNEL: false });
				}).catch(function() {
					console.error('could not assign role', ranga.name,
						'to', member.user.username,
						'on server', guild.name);
				});
			}
		}else{
			reaction.users.remove(user.id);
		}
	}

	if(reaction.message.id == funRoleMessageID) {
		if (reaction.emoji.name === '👍') {
			reaction.users.remove(user.id);
			console.log(`${user.tag} zareagował na dodanie rangi 4fun!`);
            const myuser = client.users.cache.get(user.id);
            const funRoleWelcomeEmbed = new Discord.MessageEmbed()
	        .setColor(defaultColor)
            .setTitle('Ranga 4FUN')
            .addField('Dostępne rangi:', roles4Fun.map((e) => `\`${e}\``).join(', '), true)
	        .setDescription('Aby ustawić rangę napisz jej nazwe');
			const msg = await myuser.send(funRoleWelcomeEmbed);
			const filter = collected => collected.author.id === user.id;
			const collected = await msg.channel.awaitMessages(filter, {
				max: 1,
                time: 50000,
                errors: ['time']
			}).catch(collected => {
                myuser.send('Nie udzieliłeś odpowiedzi 😢');
            });

            if(!collected) return;

			if(collected.first().content === 'anuluj') return myuser.send('Anulowano!');

			const roleName = roles4Fun.find((e) => e.toLowerCase() === collected.first().content.toLowerCase());
			if (!roleName) {
				const availableRolesString = roles4Fun.map((e) => `\`${e}\``).join(', ');
				myuser.send(`Nieznana rola \`${collected.first().content.toLowerCase()}\`\nDostępne role: ${availableRolesString}`);
			}else{
				const ranga = reaction.message.guild.roles.cache.find(role => role.name === roleName);
				if(!ranga) return myuser.send('Błąd: `Nie znaleziono roli na serwerze`');
				const guild = client.guilds.cache.get(guildID);
				const member = guild.members.cache.get(user.id);
				member.roles.add(ranga).then(function() {
					myuser.send(`Pomyślnie nadano range **${ranga.name}**`);
					console.log('Ranga', ranga.name, 'została dodana', member.user.username, 'na serwerze', guild.name);
				}).catch(function() {
					console.error('could not assign role', ranga.name,
						'to', member.user.username,
						'on server', guild.name);
				});
			}
		}else{
			reaction.users.remove(user.id);
		}
	}
});

client.login(token);
