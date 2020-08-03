var auxFunctions = (exports.auxFunctions = {})
const Discord = require('discord.js')
const dotenv = require('dotenv')
const logger = require("./logger.js").Logger;
const monitor = require('./monitor')
const axios = require('axios')
const constants = require('../constants/constants.json')

const client = new Discord.Client()
dotenv.config()
client.login(process.env.TOKEN);


auxFunctions.debugInformations = function(action){
  logger.debug('Server ' + action + ' Action::: ' + monitor.avg())
  logger.debug('Server ' + action + ' Action::: ' + monitor.total_memory())
  logger.debug('Server ' + action + ' Action::: ' + monitor.free_memory())
  logger.debug('Server ' + action + ' Action::: ' + monitor.percent_free_memory())
  logger.debug('Server ' + action + ' Action::: ' + monitor.uptime())
  logger.debug('Server ' + action + ' Action::: PING:' + Math.round(client.ws.ping) )
}

auxFunctions.errorInformations = function(action){
  logger.error('Server ' + action + ' Action::: ' + monitor.avg())
  logger.error('Server ' + action + ' Action::: ' + monitor.total_memory())
  logger.error('Server ' + action + ' Action::: ' + monitor.free_memory())
  logger.error('Server ' + action + ' Action::: ' + monitor.percent_free_memory())
  logger.error('Server ' + action + ' Action::: ' + monitor.uptime())
  logger.error('Server ' + action + ' Action::: PING:' + Math.round(client.ws.ping) )
  monitor.cpu_use_error()
}

auxFunctions.botInfos = function(action){
  logger.info(`Action: ${action}:::Bot in ${client.users.cache.size} users.`)
  logger.info(`Action: ${action}:::Bot in ${client.channels.cache.size} channels.`)
  logger.info(`Action: ${action}:::Bot in ${client.guilds.cache.size} servers.`)
}

auxFunctions.getCircularReplacer = function() {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};
