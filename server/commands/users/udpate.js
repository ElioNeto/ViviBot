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

const errrMessage001 = new Discord.MessageEmbed().setColor('#c00011').setDescription('Ocorreu um erro na gravação no banco de dados. Por favor, verifique os logs.')

module.exports = {
  lesson(){
    return(
      client.on('message', message => {
        if(message.author.bot) return;
        if(!message.content.startsWith(config.crudPrefix)) return;
    
        const args = message.content.slice(config.crudPrefix.length).trim().split(/ +/g);
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
          //console.log('!m update-lesson')

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
    )
  },

}