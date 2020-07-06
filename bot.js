const Discord = require('discord.js');
const querystring = require('querystring');
const token = 'NzI5Njk2MTc0MjAxODk3MDEy.XwMsnQ.lTNnMqA3WDWmz0n0LSDyMt05WwA';
const fetch = require('node-fetch');
//lightweight module that brings fetch to api/ using to grap api data in node
const client = new Discord.Client();
const prefix = '!';

const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);



client.once('ready', () => {
	console.log('Bot is now connected');
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
//messages that start with a ! are commands by defauls
	const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    
    //random cat picture command
    if (command === 'cat') {
        //send get request to random.cat
        //get random file from database back as json object containing link to the image
        //node fetch recieves the response and deserialisez it with response.json()
        //message is sent to server
        const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
    
        message.channel.send(file);
    }
    //urbang legend command
 else if (command === 'urban') {
    if (!args.length) {
        return message.channel.send('You need to supply a search term!');
    }

    const query = querystring.stringify({ term: args.join(' ') });

    const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());

    if (!list.length) {
        return message.channel.send(`No results found for **${args.join(' ')}**.`);
    }

    const [answer] = list;

    const embed = new Discord.MessageEmbed()
        .setColor('#EFFF00')
        .setTitle(answer.word)
        .setURL(answer.permalink)
        .addFields(
            { name: 'Definition', value: trim(answer.definition, 1024) },
            { name: 'Example', value: trim(answer.example, 1024) },
            { name: 'Rating', value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.` },
        );
    message.channel.send(embed);
}
});




client.login(token);


