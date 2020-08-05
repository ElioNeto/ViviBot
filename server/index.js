const Discord = require('discord.js')
const dotenv = require('dotenv')
const express = require('express'); 
const mongoose = require('mongoose');

const routes = require('./routes')
const getText = require('./commands/tools/material')
const cambridge = require('./commands/tools/cambridge')
const server = require('./commands/ready')
const ping = require('./commands/monitoring/ping')
const mHelp = require('./commands/monitoring/help')
const addUser = require('./commands/users/create')
const uHelp = require('./commands/users/help')
const readUser = require('./commands/users/read')
const updateUser = require('./commands/users/udpate')
const tHelp = require('./commands/tools/help')

const logger = require("../utils/logger.js").Logger;

const app = express();
const db = mongoose.connection; 
const client = new Discord.Client()

mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

db.on('connected', () => {console.log('Mongoose default connection is open');});
db.on('error', err => {console.log(`Mongoose default connection has occured \n${err}`);});
db.on('disconnected', () => {console.log('Mongoose default connection is disconnected');});

app.use(express.json());
app.use(routes);
app.listen(3334);

dotenv.config()
client.login(process.env.TOKEN);

logger.server("Initializing Server...");

/* Server session */
server.start()
server.guildDelete()
server.guildCreate()
server.selfMention()

/* Monitoring session */
mHelp.start()
ping.start()

/* Auxiliar tools session */
tHelp.start()
getText.start()
cambridge.start()

/* CRUD Users */
uHelp.start()
addUser.start()
addUser.lite()
readUser.getAllUsers()
readUser.getByName()
updateUser.lesson()