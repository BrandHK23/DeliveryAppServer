const UsersControllers = require('../controller/usersController');

module.exports = (app) => {
  app.get('/api/users/getAll', UsersControllers.getAll);

  app.post('/api/users/create', UsersControllers.register);

  app.post('/api/users/login', UsersControllers.login);
}