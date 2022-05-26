const jwt = require('jsonwebtoken')
const {models: {User}} = require('./db/init_db')
const bcrypt = require('bcrypt')
const {errorHandler} = require("./validation");
require('dotenv').config()

const SECRET1 = process.env.SECRET_1

module.exports = {
    createToken({email, password, id}, ) {
        const newToken = jwt.sign(
            {userInfo: {email, password, id}},
            SECRET1,
            {expiresIn: '1h'}
        )
        return [newToken]
    },
    async generateToken({email, password}) {
        try{
            const user = await User.findOne({where: {email}, raw: true});

            if (!user) {
                errorHandler('Wrong email',400)
            }

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                errorHandler('Wrong password',400)
            }

            const [token] = this.createToken(user);

            return {
                token,
                status : 1,
            }

        } catch(err){
            errorHandler('Something went wrong',500)
        }
    },
}

