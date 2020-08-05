const Discord = require('discord.js')
const dotenv = require('dotenv')
const config = require('../../../configs/config.json')

const client = new Discord.Client()
dotenv.config()
client.login(process.env.TOKEN);

module.exports = {
  start(){
    return(
      client.on('message', message => {
        if(message.author.bot) return;
        if(!message.content.startsWith(config.materialPrefix)) return;
    
        const args = message.content.slice(config.materialPrefix.length).trim().split(/ +/g);
        const comando = args.shift().toLowerCase();
      
        if(comando === "help") {
          const help = new Discord.MessageEmbed()
          help.setColor('#9400d3')
          help.setTitle('Help')
          help.setAuthor('Prefixo: ' + config.materialPrefix)
          help.addField('cambridge', 'Retorna um link para um teste da escola de Cambridge, para verificar o nível de conhecimento da língua inglesa.')
          help.addField('txt', 'Retorna um texto curto em inglês para praticar a pronúncia. Este texto é exibido aleatóriamente, de acordo com uma lista de textos.')
          
          message.channel.send(help)
        }
      })
    )
  }
}