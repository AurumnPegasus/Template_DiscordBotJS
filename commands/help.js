const config = require('../config/config.json');
const PREFIX = config.DISCORD_BOT.PREFIX;

module.exports = {
    name: 'help',
    description: 'Describes various commands and their uses',
    usage: '[command name]',
    argsLength: 0,
    execute(message, args){
        const { commands } = message.client;
        let data = commands.map(command => command);
        let reply = "I heard you needed some help :) \n";
        if(!args.length){
            reply += "Here is a list of all my commands \n\n";
            for(let i=0;i<data.length;i++){
                reply += "**" + data[i].name + "**" + " : " + data[i].description + "\n";
                reply += "**Usage:** " + PREFIX + data[i].name + " " + data[i].usage + "\n\n";
            }
            const embed = {
                color: '03e8fc',
                title: "<Bot Name Help>",
                description: reply
            };
            message.channel.send({ embed: embed });
        }
        else if(args.length === 1){
            try{
                reply += "\nThis command: \n";
                let commandExist = false;
                for(let i=0;i<data.length;i++){
                    if(data[i].name === args[0].trim()){
                        commandExist = true;
                        reply += data[i].description + "\n\n";
                        reply += "Correct way to use this command is: \n";
                        reply += PREFIX + data[i].name + " " + data[i].usage;
                        break;
                    }
                }
                if(!commandExist)
                    return message.channel.send(`Invalid command, try using  \'${PREFIX}help\``);
                const embed = {
                    color: '03e8fc',
                    title: "<Bot Name Help>",
                    description: reply
                };
                message.channel.send({ embed: embed });
            }
            catch(err){
                return message.channel.send(`Invalid syntax, try using \'${PREFIX}\``);

            }
        }
        else{
            return message.channel.send("Search for one argument at a time");
        }
    }
} 