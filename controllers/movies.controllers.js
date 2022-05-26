const moviesServices = require('../services/movies.services')
const {errorHandler, validateParams} = require('../validation')
const fs = require("fs");
const path = require("path");

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
            const {limit, offset, sort, order} = req.query

            if (!validateParams([Number(limit), Number(offset)], "number") ||
                !validateParams([sort, order], "string")) {
                errorHandler('Invalid input parameters', 400)
            }

            const response = await moviesServices.getMoviesList(req.query)

            res.status(200).json(response)

        } catch (err) {
            console.log(err)
            res.status(err.code).json({ok: false, message: err.message})
        }
    },
    async importMovies(req, res) {
        try {
            const fileBuffer = req.files[0].buffer
            const response = await moviesServices.importMovies(fileBuffer)
            res.send(response)
        } catch (err) {
            res.status(err.code).json({ok: false, message: err.message})
        }
    },
    async downloadMovie(req, res) {
        try {
            const id = +req.params.id
            const filePath = path.join(__dirname,'..' ,'public','movies',`${id}.txt`);
            const stat = fs.statSync(filePath);

            res.writeHead(200, {
                'Content-Type': 'multipart/form-data',
                'Content-Length': stat.size
            })

            const readStream = fs.createReadStream(filePath);
            readStream.pipe(res);

        } catch (err) {
            res.status(err.code).json({ok: false, message: err.message})
        }
    }

}
