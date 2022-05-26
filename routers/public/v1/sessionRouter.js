const router = require('express').Router();
const sessionsController = require('../../../controllers/sessions.controller');

router.post('/', sessionsController.createSession);

module.exports = router;
