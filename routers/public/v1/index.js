const router = require('express').Router()

const userRouter = require('./userRouter')
const sessionRouter = require('./sessionRouter')
const movieRouter = require('./movieRouter')

router.use('/users', userRouter)
router.use('/sessions', sessionRouter)
router.use('/movies', movieRouter)


module.exports = router
