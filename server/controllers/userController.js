const User = require('../models/userModel');

module.exports = {
  async index (req, res) {
    const users = await User.find()
    return res.json(users)
  },
  async store (req, res) {
    const { user, objective, day, lesson } = req.body

    let theUser = await User.findOne({ user })
    if(theUser) return res.json(100)
    
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
  async findByName(req, res){
    const { user } = req.query
    let theUser = await User.findOne({ user })
    return res.json(theUser)
  },
  async updateLessons(req, response) {
    const { user } = req.params;
    const { lesson } = req.body;
    const updateLesson = await User.findOneAndUpdate({user}, {lesson:lesson});
    return response.json({
      modifiedCount: updateLesson.nModified,
      ok: updateLesson.ok
    });
  },
  async delete(req, res) {
    const { user } = req.params;
    await User.deleteOne({ user });
    return res.json('Deleted');
  },

}