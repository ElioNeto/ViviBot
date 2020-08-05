const Discord = require('discord.js')
const dotenv = require('dotenv')
const axios = require('axios')

const aux = require('../../../utils/auxFunctionsMonitor').auxFunctions
const logger = require("../../../utils/logger").Logger;

const config = require('../../../configs/config.json')
const constants = require('../../../constants/constants.json')

const client = new Discord.Client()
dotenv.config()
client.login(process.env.TOKEN);

module.exports = {
  lite(){
    return(
      client.on('message', message => {
        if(message.author.bot) return;
        if(!message.content.startsWith(config.crudPrefix)) return;
    
        const args = message.content.slice(config.crudPrefix.length).trim().split(/ +/g);
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
            logger.info(JSON.stringify(response, aux.getCircularReplacer()))
          })
          .catch(function (error) {
            console.log(error);
            logger.info(JSON.stringify(error, aux.getCircularReplacer()))
          })
        }
      })
    )
  },
  start(){
    return(
      client.on('message', message => {
        if(message.author.bot) return;
        if(!message.content.startsWith(config.crudPrefix)) return;
        //if(!['660791006685298689'].includes(message.author.id)) return message.reply('nao pode, só a mamae <3')
    
        const args = message.content.slice(config.crudPrefix.length).trim().split(/ +/g);
        const comando = args.shift().toLowerCase();
      
        if(comando === "addnew") {
          let a1 = new Discord.MessageEmbed().setDescription(`Informe o usuário`)
          let a2 = new Discord.MessageEmbed().setDescription('Informe o objetivo desejado')
          let a3 = new Discord.MessageEmbed().setDescription(`Informa o número de aulas por semana`)
          let a4 = new Discord.MessageEmbed().setDescription(`Informe o total de aulas contratado`)
          aux.botInfos('addUserMsgCollector')
          aux.debugInformations('addUserMsgCollector')
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
                            .addField('Username', username)
                            .addField('Objective', objective)
                            .addField('Days', day)
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
                                  if(response.data === 100) {
                                    logger.error(constants.API_HOST)
                                    logger.error(JSON.stringify(response, aux.getCircularReplacer()))
                                    logger.error('Usuário já existe no banco de dados. Username: ' + username )
                                    a9.setDescription('Usuário já existe no banco de dados.').setColor('#c00011')
                                    message.channel.bulkDelete(9)
                                    message.channel.send(a9)  
                                    msg.delete()
                                    return
                                  }
                                  logger.info(constants.API_HOST)
                                  logger.info(JSON.stringify(response, aux.getCircularReplacer()))
                                  a9
                                    .setColor('#6afa11')
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
                                  a9.setDescription('Ocorreu um erro na gravação no banco de dados.').setColor('#c00011')
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
  },
}