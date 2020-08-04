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

const errrMessage001 = new Discord.MessageEmbed().setColor('#c00011').setDescription('Ocorreu um erro na gravação no banco de dados. Por favor, verifique os logs.')

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
  help(){
    client.on('message', message => {
      if(message.author.bot) return;
      if(!message.content.startsWith(config.monitorPrefix)) return;
  
      const args = message.content.slice(config.monitorPrefix.length).trim().split(/ +/g);
      const comando = args.shift().toLowerCase();
    
      if(comando === "help") {
        const help = new Discord.MessageEmbed()
        help.setColor('#9400d3')
        help.setTitle('Help')
        help.setAuthor('Prefixo: !m')
        help.addField('ping', 'Retorna a velocidade de resposta do servidor')
        help.addField('add', 'Comando para cadastro rápido de unuários. Utilize a seguinte sintaxe: [!m add [Usuário] [Objetivo] [Dias por Semana] [Dias Contratados]] Observação: Este comando possui a limitação de aceitar uma palavra por campo.')
        help.addField('addnew', 'Adiciona usuário seguindo uma sequencia de passos.')
        help.addField('user', 'Busca um usuário com o nome informado')
        help.addField('users', 'Busca todos os usuários cadastrados')
        help.addField('update-lesson', 'Atualiza o número de lições contratadas por um usuário. Usado ao término de uma aula ou para adicionar mais aulas.')
        message.channel.send(help)
      }
    })
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
        //if(!['660791006685298689'].includes(message.author.id)) return message.reply('nao pode, só a mamae <3')
    
        const args = message.content.slice(config.monitorPrefix.length).trim().split(/ +/g);
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
                                  //console.log(response);
                                  console.log(response.data)
                                  if(response.data === 100) {
                                    console.log(response.data)
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
  getUserByName(){
    return(
      client.on('message', message => {
        if(message.author.bot) return;
        if(!message.content.startsWith(config.monitorPrefix)) return;
    
        const args = message.content.slice(config.monitorPrefix.length).trim().split(/ +/g);
        const comando = args.shift().toLowerCase();
      
        if(comando === "user") {
          msgArray = message.content.split(' ')
          msgArray = message.content.split(' ')
          msgPrefixLength = msgArray[0].length
          msgCmdLength = msgArray[1].length
          initial = msgPrefixLength + msgCmdLength + 2
          msgUsername = message.content.substr(initial, message.content.length)

          let a9 = new Discord.MessageEmbed()
          axios.get(constants.API_GET_NAME, {
            params: {
              user: msgUsername
            }
          })
          .then(function (response) {
            logger.info(constants.API_GET_NAME)
            logger.info(JSON.stringify(response, aux.getCircularReplacer()))
            if(!response.data){
              logger.info(constants.API_GET_NAME)
              logger.info(JSON.stringify(response, aux.getCircularReplacer()))
              logger.info('Usuário não encontrado. Revise os dados e informe o nome completo do usuário. Para maiores informações, entrar em contato com o Suporte Técnico')
              a9.setDescription('Usuário não encontrado. Revise os dados e informe o nome completo do usuário. Para maiores informações, entrar em contato com o Suporte Técnico').setColor('#c00011')
              message.channel.send(a9)  
              return
            }
            a9
              .setColor('#6afa11')
              .setAuthor(response.data.user)
              .setDescription(response.data.objective)
              .addField('Dias na semana', response.data.day, true)
              .addField('Lições restantes', response.data.lesson, true)
            message.channel.send(a9)  
          })
          .catch(function (error) {
            logger.error(constants.API_GET_NAME)
            logger.error(JSON.stringify(error, aux.getCircularReplacer()))
          })
        }
      })
    )
  },
  getAllUsers(){
    return(
      client.on('message', message => {
        if(message.author.bot) return;
        if(!message.content.startsWith(config.monitorPrefix)) return;
    
        const args = message.content.slice(config.monitorPrefix.length).trim().split(/ +/g);
        const comando = args.shift().toLowerCase();
      
        if(comando === "users") {
         
          let a9 = new Discord.MessageEmbed()
          axios.get(constants.API_GET_USERS)
          .then(function (response) {
            logger.info(constants.API_GET_USERS)
            logger.info(JSON.stringify(response, aux.getCircularReplacer()))
            if(!response.data){
              logger.info(constants.API_GET_USERS)
              logger.info(JSON.stringify(response, aux.getCircularReplacer()))
              logger.info('Usuário não encontrado. Revise os dados e informe o nome completo do usuário. Para maiores informações, entrar em contato com o Suporte Técnico')
              a9.setDescription('Usuário não encontrado. Revise os dados e informe o nome completo do usuário. Para maiores informações, entrar em contato com o Suporte Técnico').setColor('#c00011')
              message.channel.send(a9)  
              return
            }
            data = response.data
            //a9.addField('Username', response.data.user)
            //message.channel.send(a9)
            data.map(res => {
              a9
              .addField('Username', res.user, true)
              .addField('Objective', res.objective,true)
              .setColor('#0a2630')
              .addField('####', '#####', true)
            }) 
            message.channel.send(a9)
          })
          .catch(function (error) {
            logger.error(constants.API_GET_NAME)
            logger.error(JSON.stringify(error, aux.getCircularReplacer()))
          })
        }
      })
    )
  },
  updateLessonNumber(){
    client.on('message', message => {
      if(message.author.bot) return;
      if(!message.content.startsWith(config.monitorPrefix)) return;
  
      const args = message.content.slice(config.monitorPrefix.length).trim().split(/ +/g);
      const comando = args.shift().toLowerCase();
    
      if(comando === "update-lesson") {
        let a1 = new Discord.MessageEmbed().setDescription(`Informe o usuário`)
        let a2 = new Discord.MessageEmbed().setDescription('A Aula foi realizada?')
        let a3 = new Discord.MessageEmbed().setDescription(`Deseja adicionar mais aulas?`)
        let a4 = new Discord.MessageEmbed().setDescription(`Quantas aulas?`)
        
        let s1 = new Discord.MessageEmbed().setDescription('Dados gravados com sucesso!')

        let e1 = new Discord.MessageEmbed().setDescription('Usuário não encontrado. Revise os dados e informe o nome completo do usuário. Para maiores informações, entrar em contato com o Suporte Técnico').setColor('#c00011')
        let e2 = new Discord.MessageEmbed().setDescription('Cancelado').setColor('#c00011')

        aux.botInfos('updateLessonNumber')
        aux.debugInformations('updateLessonNumber')
        console.log('!m update-lesson')

        message.channel.send(a1).then(()=> {
          message.channel.createMessageCollector(x => x.author.id == message.author.id, {max:1}).on('collect', c => {
            let username = c.content
            axios.get(constants.API_GET_NAME, {
              params: {
                user: username
              }
            })
            .then(function (response) {
              if(!response.data){
                logger.info(JSON.stringify(response, aux.getCircularReplacer()))
                logger.info('Usuário não encontrado. Revise os dados e informe o nome completo do usuário. Para maiores informações, entrar em contato com o Suporte Técnico')
                message.channel.send(e1)  
                return
              }
              let totalLessons = response.data.lesson
              a2.addField('Aulas restantes', totalLessons)
              message.channel.send(a2).then((msg)=> {
                msg.react('👍🏻').then(() => msg.react('👎🏻'))  
                const filter = (reaction, user) => { 
                  return ['👍🏻', '👎🏻'].includes(reaction.emoji.name) && user.id === message.author.id; 
                };
                msg.awaitReactions(filter, {max:1}).then(collected => {
                  const reaction = collected.first()
                  if (reaction.emoji.name === '👍🏻') {
                    let newLessonNumber = totalLessons - 1
                    console.log(newLessonNumber)
                    console.log(constants.API_UPDATE_LESSON_BASE+username)
                    axios.put(constants.API_UPDATE_LESSON_BASE+username,{lesson: newLessonNumber})
                    .then(function(response){
                      logger.info(JSON.stringify(response, aux.getCircularReplacer()))
                      message.channel.bulkDelete(3)
                      message.channel.send(s1)  
                      msg.delete()
                    })
                    .catch(function(error){
                      logger.error(JSON.stringify(error, aux.getCircularReplacer()))
                      message.channel.send(errrMessage001)
                    })
                  }else if(reaction.emoji.name === '👎🏻'){


                    message.channel.send(a3).then((msg)=> {
                      msg.react('👍🏻').then(()=> msg.react('👎🏻'))
                      const filter = (reaction, user) => {
                        return ['👍🏻', '👎🏻'].includes(reaction.emoji.name) && user.id === message.author.id
                      }
                      msg.awaitReactions(filter, {max:1}).then(collected => {
                        const reaction = collected.first()
                        if (reaction.emoji.name === '👍🏻') {
                          message.channel.send(a4).then(()=> {
                            message.channel.createMessageCollector(x => x.author.id == message.author.id, {max:1}).on('collect', c => {
                              lessons = c.content
                              moreLesson = parseInt(totalLessons) + parseInt(lessons)
                              axios.put(constants.API_UPDATE_LESSON_BASE+username,{lesson: moreLesson})
                              .then(function(response){
                                logger.info(JSON.stringify(response, aux.getCircularReplacer()))
                                message.channel.bulkDelete(6)
                                message.channel.send(s1)  
                                msg.delete()
                              })
                              .catch(function(error){
                                logger.error(JSON.stringify(error, aux.getCircularReplacer()))
                                message.channel.send(errrMessage001)
                              })
                            })
                          })
                        }else if(reaction.emoji.name === '👎🏻'){
                          message.channel.send(e2)
                        }
                      })
                    })
                  }
                })
              })
            })
            .catch(function (error) {
              logger.error(JSON.stringify(error, aux.getCircularReplacer()))
              send.channel.send(errrMessage001)
            })
          })
        })
      }
    })
  },

} 
