const Discord = require('discord.js')
const dotenv = require('dotenv')

const aux = require('../../utils/auxFunctionsMonitor').auxFunctions
const logger = require("../../utils/logger").Logger;

const monitor = require('../../utils/monitor')
const config = require('../../configs/config.json')

const client = new Discord.Client()
dotenv.config()
client.login(process.env.TOKEN);

module.exports={
  start(){
    client.on('ready', () => {
      console.log('Ready to use')
      logger.server('Ready to use')
      //server informations
      logger.server(monitor.plataform())
      monitor.cpu_use_server()
      logger.server(monitor.avg())
      logger.server(monitor.total_memory())
      logger.server(monitor.free_memory())
      logger.server(monitor.percent_free_memory())
      logger.server(monitor.uptime())
      aux.debugInformations('Start')
      aux.botInfos('Start')
    })
  },
  guildCreate(){
    return(
      client.on("guildCreate", guild => {	
        logger.info(`Bot start a server: ${guild.name} (id: ${guild.id}). Members: ${guild.memberCount}!`);
        aux.botInfos('guildCreate')
        aux.debugInformations('guildCreate')
      })
    )
  },
  guildDelete(){
    return(
      client.on("guildDelete", guild => {	
        logger.info(`Bot out a server: ${guild.name} (id: ${guild.id})`);	
        aux.botInfos('guildDelete')
        aux.debugInformations('guildDelete')
      })
    )
  },
  selfMention(){
    return(
      client.on('message', message => {

        const PREFIXES_CRUD = `Utilize ${config.crudPrefix} help para comandos de manutenção de usuário.`
        const PREFIXES_MONITOR = `Utilize ${config.monitorPrefix} help para comandos de manutenção de servidor.` 
        const PREFIXES_TOOLS = `Utilize ${config.materialPrefix} help para comandos de ferramentas de auxílio.` 
        
        let mentionEmbed = new Discord.MessageEmbed()
        .setTitle('Bem Vindo')
        .setDescription('Utilize os comandos de ajuda para encontrar a funcionalidade que deseja.')
        .addField('Usuários', PREFIXES_CRUD)
        .addField('Monitoramento', PREFIXES_MONITOR)
        .addField('Ferramentas e Utilitários', PREFIXES_TOOLS)
        
        if(message.content.startsWith(`<@${client.user.id}>`) || message.content.startsWith(`<@!${client.user.id}>`)) return message.channel.send(mentionEmbed)
      })
    )
  }
}