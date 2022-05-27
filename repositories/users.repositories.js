const {models: {User}} = require('../db/init_db')

module.exports = {
    findOne(conditions) {
        return User.findOne(conditions)
    },
    async createUser(newUser) {
        return User.create(newUser)
    },
}