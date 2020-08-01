const User = require('../models/userModel');

module.exports = {
  async index (req, res) {
    const users = await User.find()
    return res.json(users)
  },
  async store (req, res) {
    const { user, objective, day, lessons } = req.body

    let theUser = await User.findOne({ user })
    
    if(!theUser){
      theUser = await User.create({
        user,
        objective,
        day,
        lesson
      })
    }
    return res.json(theUser)
  },
  async userObjective(req, res){
    const { user } = req.query
    let theUser = await User.findOne({ user })
    return res.json(theUser)
  }
}