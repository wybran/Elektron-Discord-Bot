const fetch = require("node-fetch");
module.exports = {
	name: 'numerek',
	description: 'Wyświetla szczęśliwy numerek',
	execute(message, args) {
        fetch("https://elektronplusplus-76445.firebaseio.com/.json")
        .then(response => {
            return response.json();
        }).then(myJson => {
            message.channel.send(`${myJson.numerekInfo} **${myJson.numerek}**`);
        });
    },
};