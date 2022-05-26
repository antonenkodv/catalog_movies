const usersServices = require('../services/users.services')
const {errorHandler, validateParams} = require('../validation')
module.exports = {
    async createUser(req, res) {
        try {

            const {name, password, confirmPassword, email} = req.body
            if (!validateParams([name, password, email], "string")) {
                errorHandler('Invalid input parameters', 400)
            }
            if (password.localeCompare(confirmPassword) !== 0 ) errorHandler("Password and confirm password must match", 400)

            const response = await usersServices.createUser({name, password, email})
            res.status(200).json(response)
        } catch (err) {
            res.status(err.code).json({ok: false, message: err.message})
        }
    }
}
