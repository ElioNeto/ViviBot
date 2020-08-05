const Discord = require('discord.js')
const dotenv = require('dotenv')
const aux = require('../../../utils/auxFunctionsMonitor').auxFunctions
const logger = require("../../../utils/logger").Logger;
const config = require('../../../configs/config.json')

const client = new Discord.Client()
dotenv.config()
client.login(process.env.TOKEN);

module.exports = {
  start(){
    return(
      client.on("message", async message => {

        if(message.author.bot) return;
        if(message.channel.type === "dm") return;
        if(!message.content.startsWith(config.monitorPrefix)) return;

        const args = message.content.slice(config.monitorPrefix.length).trim().split(/ +/g);
        const comando = args.shift().toLowerCase();
        
        // comando ping
        if(comando === "ping") {
          const m = await message.channel.send("Ping?");
          aux.botInfos('Ping')
          aux.debugInformations('Ping')
          let apiPing = Math.round(client.ws.ping)
          let msg =`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms.`
          if(!apiPing){
            m.edit(msg)
            logger.error('ERROR Receive Null in Ping Api :::: Command = Math.round(client.ws.ping)')
            logger.error(`ERROR ${message.author} ${message.author.username} use command PING`)
            logger.error(`ERROR ${message.author} ${message.author.username} receive this response: ${msg}`)
            aux.errorInformations('Ping')
            return
          }
          msg = `Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A Latencia da API é ${apiPing}ms`
          logger.info(`INFO ${message.author} ${message.author.username} use command PING`)
          logger.info(`INFO ${message.author} - *** ${message.author.username} *** on server ### ${message.guild.name} ### receive this response: ${msg}`)
          m.edit(msg); 
        }
      })
    )
  }
}