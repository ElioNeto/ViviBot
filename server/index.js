const logger = require("../utils/logger.js").Logger;
const Discord = require('discord.js')
const dotenv = require('dotenv')
const cmd = require('./commands')
const material = require('./commands/material')

const express = require('express'); 
const mongoose = require('mongoose');

const routes = require('./routes')
const app = express();
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
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
cmd.getUserByName()
cmd.getAllUsers()
cmd.updateLessonNumber()
cmd.help()
material.getTxt()