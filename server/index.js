const logger = require("../utils/logger.js").Logger;
const Discord = require('discord.js')
const config = require('../configs/config.json')
const monitor = require('../utils/monitor')
const dotenv = require('dotenv')

const client = new Discord.Client()
dotenv.config()
client.login(process.env.TOKEN);
logger.server("Initializing Server...");

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

  debugInformations('Start')
  botInfos('Start')
  
})

client.on("guildCreate", guild => {	
  logger.info(`Bot start a server: ${guild.name} (id: ${guild.id}). Members: ${guild.memberCount}!`);
  botInfos('guildCreate')
});	

client.on("guildDelete", guild => {	
  logger.info(`Bot out a server: ${guild.name} (id: ${guild.id})`);	
  botInfos('guildDelete')
});

function debugInformations(action){
  logger.debug('Server ' + action + ' Action::: ' + monitor.avg())
  logger.debug('Server ' + action + ' Action::: ' + monitor.total_memory())
  logger.debug('Server ' + action + ' Action::: ' + monitor.free_memory())
  logger.debug('Server ' + action + ' Action::: ' + monitor.percent_free_memory())
  logger.debug('Server ' + action + ' Action::: ' + monitor.uptime())
  logger.debug('Server ' + action + ' Action::: PING:' + Math.round(client.ws.ping) )
}

function botInfos(action){
  logger.info(`Action: ${action}:::Bot start in ${client.users.cache.size} users.`)
  logger.info(`Action: ${action}:::Bot start in ${client.channels.cache.size} channels.`)
  logger.info(`Action: ${action}:::Bot start in ${client.guilds.cache.size} servers.`)
}