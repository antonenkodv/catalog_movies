const userRepositories = require('../repositories/users.repositories')
const Auth = require("../auth");
const {errorHandler} = require("../validation");

module.exports = {
    async createSession({password, email}) {
        try {
            const isExist = await userRepositories.findOne({where: {email}, raw: true})
            if (!isExist) return {message: "User does not exist"}
            return Auth.generateToken({password, email})
        } catch (err) {
            errorHandler("Something went wrong", 500)
        }
    }
}