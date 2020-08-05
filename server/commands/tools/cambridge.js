const Discord = require('discord.js')
const dotenv = require('dotenv')

const config = require('../../../configs/config.json')

const client = new Discord.Client()
dotenv.config()
client.login(process.env.TOKEN);

module.exports = {
  start(){
    client.on('message', message => {
      if(message.author.bot) return;
      if(!message.content.startsWith(config.materialPrefix)) return;
      const args = message.content.slice(config.materialPrefix.length).trim().split(/ +/g);
      const comando = args.shift().toLowerCase();
    
      if(comando === "cambridge") {
        const linkTestCambridge = 'https://www.cambridgeenglish.org/br/test-your-english/general-english/'
        let link = new Discord.MessageEmbed()
        link.setColor('#333')
        link.setTitle('Link para o teste')
        link.setDescription('Após concluir o teste, envie a URL para que possamos trabalhar com o resultado.')
        link.addField('Teste Cambridge', `[Acessar](${linkTestCambridge})`)
        message.channel.bulkDelete(1)
        message.channel.send(link)  
        message.delete()
      }
    })
  }
}