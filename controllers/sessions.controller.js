const sessionsServices = require('../services/sessions.services')
const {errorHandler, validateParams} = require('../validation')
module.exports = {
    async createSession(req, res) {
        try {
            const { password, email} = req.body
            if (!validateParams([password, email], "string")) {
                errorHandler('Invalid input parameters', 400)
            }

            const response = await sessionsServices.createSession({ password, email})
            res.status(200).json(response)

        } catch (err) {
            res.status(err.code).json({ok: false, message: err.message})
        }
    }
}
