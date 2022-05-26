const jwt = require('jsonwebtoken')
const {models: {User}} = require('../db/init_db')


module.exports = async (req, res, next) => {

    const token = req.headers['authorization']
    if (token) {
        try {
            const {userInfo: {email}} = jwt.decode(token)
            const user = await User.findOne({where: {email}, raw: true})
            user ? req.user = user : (res.status(500).send('No such user'))
        } catch (err) {
            return res.status(500).send('Wrong authorization')
        }
    } else {
        return res.status(401).send('Missing access token');
    }
    next()
}
