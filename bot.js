// Imports
const discord = require('discord.js');
const client = new discord.Client();
const config = require('./config/config.json');
const fs = require('fs');

// Initialisation
const PREFIX = config.DISCORD_BOT.PREFIX;
client.commands = new discord.Collection();
client.login(config.DISCORD_BOT.TOKEN);
client.on('ready', () => {
    console.log(`${client.user.tag} has logged in`);
});

// Get all commands 
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Event listeners
client.on('message', (message) => {
    if(message.author.bot || !message.content.startsWith(PREFIX))
        return;
    let commandName = null;
    let args;

    if(message.content.indexOf(" ") <= 0) // Commands without arguments
    {
        commandName = message.content.trim().substring(PREFIX.length);
        args = [];
    } 
    else  // Commands with arguments
    {
        commandName = message.content.trim().substring(0, message.content.indexOf(" ")).substring(PREFIX.length);
        args = message.content.trim().substring(commandName.length + PREFIX.length).split(",");
    }

    const command = client.commands.get(commandName);
    if(!client.commands.has(commandName))
        return;

    // Execution of commands
    try{
        if(commandName === 'help')
            command.execute(message, args);
        else if(command.argsLength === args.length)
            command.execute(message, args);
        else{
            let reply = `${message.author} You havent specified any arguments`;
            if(command.usage) 
                reply += `\nThe proper usage would be:\n\`${PREFIX}${command.name} ${command.usage}\``;
            reply += `\nUse \`${PREFIX}help\` to know more`;
            message.channel.send(reply);
        }
    }
    catch(err){
        message.channel.send("Something went wrong");
        console.log(err);
    }
});  