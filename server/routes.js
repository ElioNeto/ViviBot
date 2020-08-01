const { Router } = require('express');
const UserController = require ('./controllers/userController')

const routes = Router();

routes.get('/users', UserController.index)
routes.post('/newuser', UserController.store)

module.exports = routes;