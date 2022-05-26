const sessionsRepositories = require('../repositories/sessions.repositories')

module.exports = {
    async createSession({password , email}) {
        return  sessionsRepositories.createSession({ password, email })
    }
}