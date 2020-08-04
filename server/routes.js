const { Router } = require('express');
const UserController = require ('./controllers/userController')

const routes = Router();

routes.get('/users', UserController.index)
routes.post('/newuser', UserController.store)
routes.get('/user', UserController.findByName)
routes.put('/lessonsUpdateNumber/:user', UserController.updateLessons)
routes.delete('/userDelete/:user', UserController.delete)

module.exports = routes;