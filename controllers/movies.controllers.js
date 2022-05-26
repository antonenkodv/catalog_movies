const moviesServices = require('../services/movies.services')
const {errorHandler, validateParams} = require('../validation')
module.exports = {
    async createMovie(req, res) {
        try {
            const {title, year, format, actors} = req.body

            if (!validateParams([title, format], "string") ||
                !validateParams([year], "number") ||
                Array.isArray(actors) == false || actors.length === 0) {
                errorHandler('Invalid input parameters', 400)
            }

            const response = await moviesServices.createMovie({title, year, format, actors})
            res.status(200).json(response)

        } catch (err) {
            res.status(err.code).json({ok: false, message: err.message})
        }
    },
    async deleteMovie(req, res) {
        try {
            const id = +req.params.id
            if (!validateParams([Number(id)], "number")) {
                errorHandler('Invalid input parameters', 400)
            }
            const response = await moviesServices.deleteMovie({id})
            res.status(200).json(response)
        } catch (err) {
            res.status(err.code).json({ok: false, message: err.message})
        }

    },
    async updateMovie(req, res) {
        try {
            const id = +req.params.id
            const {body: data} = req

            if (!validateParams([Number(id)], "number")) {
                errorHandler('Invalid input parameters', 400)
            }
            const response = await moviesServices.updateMovie({id, data})
            res.status(200).json(response)
        } catch (err) {
            res.status(err.code).json({ok: false, message: err.message})
        }
    },
    async showMovie(req, res) {
        try {
            const id = +req.params.id
            if (!validateParams([Number(id)], "number")) {
                errorHandler('Invalid input parameters', 400)
            }
            const response = await moviesServices.showMovie({id})
            res.status(200).json(response)
        } catch (err) {
            res.status(err.code).json({ok: false, message: err.message})
        }
    },
    async getMoviesList(req, res) {
        try {
            const { limit , offset , sort , order} = req.query

            if (!validateParams([Number(limit),Number(offset)], "number") ||
                !validateParams([sort, order], "string")) {
                errorHandler('Invalid input parameters', 400)
            }

            const response = await moviesServices.getMoviesList(req.query)

            res.status(200).json(response)

        } catch (err) {
            console.log(err)
            res.status(err.code).json({ok: false, message: err.message})
        }
    }

}
