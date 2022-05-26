const {models: {User}} = require('../db/init_db')
const Auth = require('../auth')
const {errorHandler} = require("../validation");

module.exports = {
    async createSession({ password, email}) {
        try{
            const isExist = await User.findOne({where: {email}, raw: true})
            if (!isExist) return {message : "User does not exist"}
            return Auth.generateToken({password , email})
        }catch(err){
            errorHandler("Something went wrong" , 500)
        }
    },
}