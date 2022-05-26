const usersRepositories = require('../repositories/users.repositories')

module.exports = {
    async createUser({name,password , email}) {
            return  usersRepositories.createUser({name,password, email })
    }
}