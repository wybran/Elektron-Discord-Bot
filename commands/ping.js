module.exports = {
	name: 'ping',
	description: 'Wyświetla ping',
	execute(message, args) {
        message.channel.send("**Ping**: `" + Math.round(message.client.ws.ping) + "ms`");
    },
};