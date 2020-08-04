const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  user: String,
  objective: String,
  day: String,
  lesson: String
})

module.exports = mongoose.model('UserDiscord', UserSchema);