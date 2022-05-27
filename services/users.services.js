const usersRepositories = require('../repositories/users.repositories')
const bcrypt = require("bcrypt");
const uuid = require("uuid4");
const Auth = require("../auth");
const {errorHandler} = require("../validation");

module.exports = {
    async createUser({name,password , email}) {
        try{
            const isExist = await usersRepositories.findOne({where: {email}, raw: true})
            if (!isExist) {
                const hashedPassword = await bcrypt.hash(password, 12)

                const newUser = {
                    id: uuid(),
                    name,
                    email,
                    password: hashedPassword,
                }
                await usersRepositories.createUser(newUser)
                return Auth.generateToken({password, email})
            }
            return {message : "User already exist"}
        }catch(err){
            errorHandler("Something went wrong" , 500)
        }
    }
}