const logger = require("../utils/logger.js").Logger;
const Discord = require('discord.js')
const dotenv = require('dotenv')
const cmd = require('./commands')

const express = require('express'); 
const mongoose = require('mongoose');
const axios = require('axios')

const routes = require('./routes')
const app = express();
mongoose.connect('mongodb+srv://Elioneto:Elinho123@cluster0-zvkiv.mongodb.net/week10?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const db = mongoose.connection; 
db.on('connected', () => {console.log('Mongoose default connection is open');});
db.on('error', err => {console.log(`Mongoose default connection has occured \n${err}`);});
db.on('disconnected', () => {console.log('Mongoose default connection is disconnected');});
app.use(express.json());
app.use(routes);
app.listen(3334);
const client = new Discord.Client()
dotenv.config()
client.login(process.env.TOKEN);
logger.server("Initializing Server...");

cmd.start()
cmd.guildCreate()
cmd.guildDelete()
cmd.ping()
cmd.document()
cmd.consoleMsg()
cmd.addUser()
cmd.addUserMsgCollector()
/* 
axios.post('http://127.0.0.1:3334/newuser', {
  user: 'teste',
  objective: 'Flintstone',
  day: 3,
  lesson: 20
})
.then(function (response) {
  console.log(response);
})
.catch(function (error) {
  console.log(error);
}); *//* 

axios.get('http://127.0.0.1:3334/users')
  .then(function (response) {
    // handle success
    console.log(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  }); */