const Discord = require('discord.js')
const dotenv = require('dotenv')
const axios = require('axios')
const translate = require('@vitalets/google-translate-api');

const aux = require('../../utils/auxFunctionsMonitor').auxFunctions
const logger = require("../../utils/logger").Logger;

const monitor = require('../../utils/monitor')
const config = require('../../configs/config.json')
const constants = require('../../constants/constants.json')

const client = new Discord.Client()
dotenv.config()
client.login(process.env.TOKEN);

//https://ingleswinner.com/blog/texto-em-ingles-para-expandir-vocabulario/
//https://www.inglesnapontadalingua.com.br/

const txt001 = {
  "title": "CAROL",
  "txt": "It was my birthday. My boyfriend Daniel came to my house to take me out for dinner. I opened the door, and he had a big bunch of flowers and a very nice car. He rented the car just to take me out. I was really surprised."
}
const txt002 = {
  "title": 'MICHAEL',
  "txt":"I went to our house in the country with my Family. It’s a small house in a village in the mountains. We often go there at the weekends and we usually go there for a few weeks in the summer. It was really hot when we went this weekend. It was 35 degrees. I was surprised because it’s July. It’s usually cold."  
}
const txt003 = {
"title": "SANDRA",
"txt":"I had a really terrible weekend. My boyfriend took me out to this really expensive restaurant. In the middle of our dinner, he gave me a very beautiful ring and he asked me to marry him. I was really surprised. I said no. I like him, but I knew I didn’t want to marry him. He was quite angry and sad. It was awful."
}
const txt004 = {
"title":"RAY",
"txt":"I had a great weekend. My wife and I got married 30 years ago. My wife and I were really surprised when our son came to our house on Thursday evening. He then took us to the airport and gave us two tickets to go to Rome! He paid for everything: the flight, the hotel, everything. We had a lovely weekend. We remembered the night we got married. It was wonderful."
}
const txt005 ={
  "title": "Basic",
  "txt": "SANDRA IS VERY BEAUTIFUL, YOUNG, AND SUCCESSFUL. SHE’S A FAMOUS ACTRESS. SHE’S ALSO VERY RICH. HER HOUSE NEAR THE BEACH IS BIG AND BEAUTIFUL, AND HER CAR IS VERY EXPENSIVE. HER FANS LOVE HER. BUT IS SHE HAPPY?"
}
const txt006 = {
  "title": "Basic",
  "txt": "SANDRA SAYS, “YEAH, I’M YOUNG, RICH, BEAUTIFUL, AND FAMOUS. PEOPLE THINK RICH PEOPLE ARE HAPPY. THAT’S NOT ALWAYS TRUE!“"
}
const txt007 = {
  "title": "Basic",
  "txt": "SANDRA’S BROTHER, MIKE, IS HER MANAGER. HE SAYS, “SANDRA IS ONLY 18. SHE ENJOYS ACTING AND ENTERTAINING PEOPLE. BUT SHE’S NOT HAPPY. SHE DOESN’T LIKE BEING FAMOUS.“"
}
const txt008 = {
  "title": "Basic",
  "txt": "“IT’S TRUE,” SANDRA SAYS. “I’M NEVER ALONE. REPORTERS ARE EVERYWHERE. WHEREVER I GO, THEY’RE THERE. THEY’RE OUTSIDE MY HOUSE ALL THE TIME! THAT’S SO ANNOYING!“."
}
const txt009 = {
  "title": "Vocabulary",
  "txt": "There are some advantages to not being elected President of the United States – like you can go to see the new “Twilight” movie without making a big fuss, which is exactly what Mitt Romney did this weekend."
}
const txt010 = {
  "title": "Quick and easy",
  "txt": "In Brazil, a lot of people try to save time. In most families, both the husband and the wife work full-time, so their free time is very short and very important to them. They look for quick and convenient ways to do their shopping and other things, so they can have free time to enjoy themselves and do the things they really like to do."
}
module.exports = {
  getTxt(){
    client.on('message', message => {
      if(message.author.bot) return;
      if(!message.content.startsWith(config.materialPrefix)) return;
      const args = message.content.slice(config.materialPrefix.length).trim().split(/ +/g);
      const comando = args.shift().toLowerCase();
    
      if(comando === "txt") {

        /* Sortear número  (máx 10)*/
        let randon = Math.floor(Math.random() * 10 + 1)
        let title = ''
        let content = ''

        if (randon === 1){
          title = txt001.title
          content = txt001.txt
        }
        if (randon === 2){
          title = txt002.title
          content = txt002.txt
        }
        if (randon === 3){
          title = txt003.title
          content = txt003.txt
        }
        if (randon === 4){
          title = txt004.title
          content = txt004.txt
        }
        if (randon === 5){
          title = txt005.title
          content = txt005.txt
        }
        if (randon === 6){
          title = txt006.title
          content = txt006.txt
        }
        if (randon === 7){
          title = txt007.title
          content = txt007.txt
        }
        if (randon === 8){
          title = txt008.title
          content = txt008.txt
        }
        if (randon === 9){
          title = txt009.title
          content = txt009.txt
        }
        if (randon === 10){
          title = txt010.title
          content = txt010.txt
        }

        let emb01 = new Discord.MessageEmbed().setColor('#1aFa00')
        let emb02 = new Discord.MessageEmbed().setColor('#1aFa00')
        
        emb01.addField(title, content)
        console.log(randon)

        message.channel.send(emb01)
        message.channel.send('Translate? ').then(msg => {                                                                       
          msg.react('👍🏻')   
          const filter = (reaction, user) => { 
            return ['👍🏻'].includes(reaction.emoji.name) && user.id === message.author.id; 
          };
          msg.awaitReactions(filter, {max: 1}).then(collected => {
            const reaction = collected.first();
            if (reaction.emoji.name === '👍🏻') {
              message.channel.send('Traduzindo...')
              translate(content, {to: 'pt'}).then(res => {
                translate(title, {to: 'pt'}).then(resTitle => {
                  emb02.addField(resTitle.text, res.text)
                  message.channel.send(emb02)
                })
              })
            }
          })
        })
      }
    })
  },
}