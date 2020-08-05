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

const CODE_404 = 'Usuário não encontrado. Revise os dados e informe o nome completo do usuário. Para maiores informações, entrar em contato com o Suporte Técnico.' 
const CODE_EMPTY = 'Nenhum dado para ser exibido. Verifique sua conexão de internet e o ping. Para maiores informações, entrar em contato com o Suporte Técnico. '

module.exports = {
  getByName(){
    return(
      client.on('message', message => {
        if(message.author.bot) return;
        if(!message.content.startsWith(config.crudPrefix)) return;
    
        const args = message.content.slice(config.crudPrefix.length).trim().split(/ +/g);
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
              logger.info(CODE_404)
              a9.setDescription(CODE_404).setColor('#c00011')
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
        if(!message.content.startsWith(config.crudPrefix)) return;
    
        const args = message.content.slice(config.crudPrefix.length).trim().split(/ +/g);
        const comando = args.shift().toLowerCase();
      
        if(comando === "users") {
          message.channel.send('Aguarde...')
          let a9 = new Discord.MessageEmbed()
          axios.get(constants.API_GET_USERS)
          .then(function (response) {
            logger.info(JSON.stringify(response, aux.getCircularReplacer()))
            if(!response.data){
              logger.info(JSON.stringify(response, aux.getCircularReplacer()))
              logger.info(CODE_EMPTY)
              a9.setDescription(CODE_EMPTY).setColor('#c00011')
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
              .addField('####', '####', true)
            }) 
            message.channel.send(a9)
          })
          .catch(function (error) {
            console.log(error)
            logger.error(JSON.stringify(error, aux.getCircularReplacer()))
          })
        }
      })
    )
  },
}