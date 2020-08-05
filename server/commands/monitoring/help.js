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
        if(!message.content.startsWith(config.monitorPrefix)) return;
    
        const args = message.content.slice(config.monitorPrefix.length).trim().split(/ +/g);
        const comando = args.shift().toLowerCase();
      
        if(comando === "help") {
          const help = new Discord.MessageEmbed()
          help.setColor('#9400d3')
          help.setTitle('Help')
          help.setAuthor('Prefixo: ' + config.monitorPrefix)
          help.addField('ping', 'Retorna a velocidade de resposta do servidor')
          /* help.addField('add', 'Comando para cadastro rápido de unuários. Utilize a seguinte sintaxe: [!m add [Usuário] [Objetivo] [Dias por Semana] [Dias Contratados]] Observação: Este comando possui a limitação de aceitar uma palavra por campo.')
          help.addField('addnew', 'Adiciona usuário seguindo uma sequencia de passos.')
          help.addField('user', 'Busca um usuário com o nome informado')
          help.addField('users', 'Busca todos os usuários cadastrados')
          help.addField('update-lesson', 'Atualiza o número de lições contratadas por um usuário. Usado ao término de uma aula ou para adicionar mais aulas.')
           */message.channel.send(help)
        }
      })
    )
  }
}