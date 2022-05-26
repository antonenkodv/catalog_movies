const {models: {User}} = require('../db/init_db')
const bcrypt = require('bcrypt')
const uuid = require('uuid4')
const Auth = require('../auth')
const {errorHandler} = require("../validation");

module.exports = {
    async createUser({name, password, email}) {
        try{
            const isExist = await User.findOne({where: {email}, raw: true})
            if (!isExist) {
                const hashedPassword = await bcrypt.hash(password, 12)

                const newUser = {
                    id: uuid(),
                    name,
                    email,
                    password: hashedPassword,
                }
                await User.create(newUser)
                return Auth.generateToken({password, email})
            }
           return {message : "User already exist"}
        }catch(err){
            errorHandler("Something went wrong" , 500)
        }
    },
}