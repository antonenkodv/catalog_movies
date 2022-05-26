const router = require('express').Router();
const apiRouter = require('./public/v1');

router.get('/', (req, resp) => {
        console.log('Health Check')
        resp.sendStatus(200)
    }
);

router.use('/api/v1',apiRouter);

module.exports = router;
