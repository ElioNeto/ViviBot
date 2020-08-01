const Discord = require('discord.js')
const dotenv = require('dotenv')
const axios = require('axios')

const aux = require('../../utils/auxFunctionsMonitor').auxFunctions
const logger = require("../../utils/logger").Logger;

const monitor = require('../../utils/monitor')
const config = require('../../configs/config.json')
const constants = require('../../constants/constants.json')

const client = new Discord.Client()
dotenv.config()
client.login(process.env.TOKEN);

module.exports={
  start(){
    return(
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
    )
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
  ping(){
    client.on("message", async message => {

      if(message.author.bot) return;
      if(message.channel.type === "dm") return;
      if(!message.content.startsWith(config.monitorPrefix)) return;
  
      const args = message.content.slice(config.monitorPrefix.length).trim().split(/ +/g);
      const comando = args.shift().toLowerCase();
      
      // coamdno ping
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
      
    });
  },
  document(){
    client.on('message', message => {
      // If the message is '!rip'
      if (message.content === '!rip') {
        // Create the attachment using MessageAttachment
        const attachment = new Discord.MessageAttachment('http://files.customersaas.com/files/Samsung_A510F_Galaxy_A5_(2016)_Manual_do_usu%C3%A1rio.pdf');
        // Send the attachment in the message channel with a content
        message.channel.send(`${message.author},`, attachment);
      }
    });
  },
  consoleMsg(){
    client.on('message', message => {
      if(message.author.bot) return;
      if(!message.content.startsWith(config.monitorPrefix)) return;
  
      const args = message.content.slice(config.monitorPrefix.length).trim().split(/ +/g);
      const comando = args.shift().toLowerCase();
    
      if(comando === "msg") {
        msgArray = message.content.split(' ')
        msgPrefixLength = msgArray[0].length
        msgCmdLength = msgArray[1].length
        initial = msgPrefixLength + msgCmdLength + 2
        console.log(message.content.substr(initial, message.content.length))
      }
    });
  },
  addUser(){
    return(
      client.on('message', message => {
        if(message.author.bot) return;
        if(!message.content.startsWith(config.monitorPrefix)) return;
    
        const args = message.content.slice(config.monitorPrefix.length).trim().split(/ +/g);
        const comando = args.shift().toLowerCase();
      
        if(comando === "add") {
          msgArray = message.content.split(' ')
          msgPrefixLength = msgArray[0].length
          msgCmdLength = msgArray[1].length

          msgUsername = msgArray[2]
          msgObjective = msgArray[3]
          msgDays = msgArray[4],
          msgLesson = msgArray[5]

          axios.post(constants.API_HOST, {
            user: msgUsername,
            objective: msgObjective,
            day: msgDays,
            lesson: msgLesson
          })
          .then(function (response) {
            console.log(response);
            logger.info(constants.API_HOST)
            logger.info(JSON.stringify(response, aux.getCircularReplacer()))
          })
          .catch(function (error) {
            console.log(error);
            logger.info(constants.API_HOST)
            logger.info(JSON.stringify(error, aux.getCircularReplacer()))
          })
        }
      })
    )
  },
  addUserMsgCollector(){
    return(
      client.on('message', message => {
        if(message.author.bot) return;
        if(!message.content.startsWith(config.monitorPrefix)) return;
    
        const args = message.content.slice(config.monitorPrefix.length).trim().split(/ +/g);
        const comando = args.shift().toLowerCase();
      
        if(comando === "addnew") {
          let a1 = new Discord.MessageEmbed().setDescription(`Informe o usuário`)
          let a2 = new Discord.MessageEmbed().setDescription('Informe o objetivo desejado')
          let a3 = new Discord.MessageEmbed().setDescription(`Informa o número de aulas por semana`)
          let a4 = new Discord.MessageEmbed().setDescription(`Informe o total de aulas contratado`)

          message.channel.send(a1).then( () => {
            message.channel.createMessageCollector(x => x.author.id == message.author.id, {max: 1}).on('collect', c => {
              let username = c.content
              message.channel.send (a2).then( () => {
                message.channel.createMessageCollector(x => x.author.id == message.author.id, {max:  1}).on('collect', c => {
                  objective = c.content
                  message.channel.send(a3).then( () => {
                    message.channel.createMessageCollector(x => x.author.id == message.author.id, {max: 1}).on('collect', c => {
                      day = c.content
                      message.channel.send(a4).then( () => {
                        message.channel.createMessageCollector(x => x.author.id == message.author.id, {max: 1}).on('collect', c => {
                          lesson = c.content
                          let a8 = new Discord.MessageEmbed()
                            .setDescription(`Deseja gravar as seguintes informações?`)
                            .addField('Username', username, true)
                            .addField('Objective', objective, true)
                            .addField('Days', day, true)
                            .addField('Lesson', lesson, true)
                          message.channel.send(a8).then(msg => {                                                                       
                            msg.react('👍🏻').then(() => msg.react('👎🏻'))   
                            const filter = (reaction, user) => { 
                              return ['👍🏻', '👎🏻'].includes(reaction.emoji.name) && user.id === message.author.id; 
                            };
                            msg.awaitReactions(filter, {max: 1}).then(collected => {
                              const reaction = collected.first();
                              if (reaction.emoji.name === '👍🏻') { 
                                let a9 = new Discord.MessageEmbed()
                                axios.post(constants.API_HOST, {
                                  user: username,
                                  objective: objective,
                                  day: day,
                                  lesson: lesson
                                }).then(function (response) {
                                  //console.log(response);
                                  logger.info(constants.API_HOST)
                                  logger.info(JSON.stringify(response, aux.getCircularReplacer()))
                                  a9
                                    .setDescription('Gravado com sucesso!')
                                    .addField('Username', username, true)
                                    .addField('Objective', objective, true)
                                    .addField('Days', day, true)
                                    .addField('Lesson', lesson, true)
                                  message.channel.bulkDelete(9)
                                  message.channel.send(a9)  
                                  msg.delete()
                                }).catch(function (error) {
                                  //console.log(error);
                                  logger.error(constants.API_HOST)
                                  logger.error(JSON.stringify(error, aux.getCircularReplacer()))
                                  //logger.error(error);
                                  a9.setDescription('Ocorreu um erro na gravação no banco de dados.')
                                  message.channel.bulkDelete(9)
                                  message.channel.send(a9)  
                                  msg.delete()
                                })
                                
                              } else if(reaction.emoji.name === '👎🏻') { 
                                let a6 = new Discord.MessageEmbed().setDescription('Cadastro cancelado!')
                                message.channel.send(a6)
                                msg.delete()
                                message.channel.bulkDelete(9)
                                logger.info('Registrer action canceled')
                              }
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        }
      })
    )
  }
}
