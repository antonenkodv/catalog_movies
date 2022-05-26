const router = require('express').Router();
const usersController = require('../../../controllers/users.controller');

router.post('/', usersController.createUser);

module.exports = router;
