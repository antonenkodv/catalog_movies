const moviesRepositories = require('../repositories/movies.repositories')
const actorsRepositories = require("../repositories/actors.repositories");
const {models: {Movie}, sequelize} = require('../db/init_db')
const {formateMoviesList, formateDate, createImportFile, formateResponse} = require('../functions/movies')
const {errorHandler} = require("../validation");
const {Sequelize} = require("sequelize");

module.exports = {
    async createMovie({title, year, format, actors, source = null}) {
        try {
            const newMovie = {title, year, format, actors, source}
            let unexistedIds = []
            let existedIds = []
            for (const name of actors) {
                const actor = await actorsRepositories.findOne({where: {name}})
                if (actor) existedIds.push(actor.id)
                else {
                    unexistedIds.push(actorsRepositories.createOne({name}))
                }
            }
            const t = await sequelize.transaction();
            if (unexistedIds.length) {
                unexistedIds = await Promise.all(unexistedIds)
                unexistedIds = unexistedIds.map(actor => actor.dataValues.id)
            }
            let {dataValues} = await moviesRepositories.createOne({
                ...newMovie,
                actors: [...existedIds, ...unexistedIds]
            })
            await t.commit();

            dataValues.actors = await actorsRepositories.findAllActorsByIds([...existedIds, ...unexistedIds])
            return {data: dataValues, status: 1}
        } catch (err) {
            console.log(err)
            await t.rollback();
            errorHandler("Something went wrong", 500)
        }
    },
    async deleteMovie({id}) {
        try {
            const movie = await moviesRepositories.findOne({where: {id}, raw: true})
            if (movie) {
                await moviesRepositories.destroyOne({where: {id}})
                return {status: 1}
            } else {
                return {message: "No such movie"}
            }
        } catch (err) {
            errorHandler("Something went wrong", 500)
        }
    },
    async updateMovie({id, data}) {
        try {
            let {title, year, format, actors} = data
            let unexistedIds = []
            let existedIds = []
            for (const name of actors) {
                const actor = await actorsRepositories.findOne({where: {name}})
                if (actor) existedIds.push(actor.id)
                else {
                    unexistedIds.push(actorsRepositories.createOne({name}))
                }
            }
            const t = await sequelize.transaction();
            if (unexistedIds.length) {
                unexistedIds = await Promise.all(unexistedIds)
                unexistedIds = unexistedIds.map(actor => actor.dataValues.id)
            }
            await moviesRepositories.updateOne({
                title,
                year,
                format,
                actors: [...existedIds, ...unexistedIds]
            }, {where: {id}})
            await t.commit();

            const result = await moviesRepositories.findOne({
                where: {id},
                attributes: ["id", "title", "year", "format"],
                raw: true
            })
            result.actors = await actorsRepositories.findAllActorsByIds([...existedIds, ...unexistedIds])
            return {data: result, status: 1}
        } catch (err) {
            console.log(err)
            await t.rollback();
            errorHandler("Something went wrong", 500)
        }
    },
    async showMovie({id}) {
        try {
            const movie = await moviesRepositories.findOne({where: {id}, raw: true})
            if (movie) {
                movie.actors = await actorsRepositories.findAllActorsByIds(movie.actors)
                return {data: movie, status: 1}
            } else {
                return {message: "No such movie"}
            }
        } catch (err) {
            errorHandler("Something went wrong", 500)
        }
    },
    async getMoviesList(queryData) {
        const {sort, order = "ASC", limit = 20, offset = 0, actor = null, title = null, search = null} = queryData

        let searchParam = [
            {name: "actor", value: actor},
            {name: "title", value: title},
            {name: "search", value: search}]
            .find(param => param.value)
        let result = null
        try {
            if (searchParam) {
                if (searchParam.name === "actor") {
                    const actor = await actorsRepositories.findOne({
                        where: {name: {[Sequelize.Op.like]: `%${searchParam.value}%`}},
                        raw: true
                    })

                    if (actor) {
                        const {id: actorId} = actor
                        result = await moviesRepositories.findAndCount({
                            where: {
                                actors: {[Sequelize.Op.contains]: [actorId]}
                            },
                            attributes: ["id", "title", "year", "format", "createdAt", "updatedAt"],
                            limit,
                            offset,
                            raw: true
                        })
                        return formateResponse(result)
                    } else {
                        return {message: "No such actor"}
                    }
                }
                if (searchParam.name === 'title') {
                    result = await moviesRepositories.findAndCount({
                        where: {title: {[Sequelize.Op.like]: `%${searchParam.value}%`}},
                        attributes: ["id", "title", "year", "format", "createdAt", "updatedAt"],
                        order: [[sort, order]],
                        limit,
                        offset,
                        raw: true
                    })
                    return formateResponse(result)
                }
                if (searchParam.name === 'search') {
                    const actor = await actorsRepositories.findOne({
                        where: {name: {[Sequelize.Op.like]: `%${searchParam.value}%`}},
                        raw: true
                    })
                    if (actor) {
                        const {id: actorId} = actor
                        result = await moviesRepositories.findAndCount({
                            where:
                                {
                                    actors: {[Sequelize.Op.contains]: [actorId]},
                                    title: {[Sequelize.Op.like]: `%${searchParam.value}%`},
                                },
                            attributes: ["id", "title", "year", "format", "createdAt", "updatedAt"],
                            limit,
                            offset,
                            raw: true
                        })
                        return formateResponse(result)
                    } else {
                        return {message: "No such actor"}
                    }
                }

            }


            result = await moviesRepositories.findAndCount({
                attributes: ["id", "title", "year", "format", "createdAt", "updatedAt"],
                order: [[sort, order]],
                limit,
                offset,
                raw: true
            })
            return formateResponse(result)
        } catch (err) {
            console.log(err)
            errorHandler("Something went wrong", 500)
        }
    },
    async importMovies(fileBuffer) {

        const date = formateDate()
        const filePath = await createImportFile(fileBuffer, date)
        movies = formateMoviesList(fileBuffer, filePath)
        let result = {data: [], meta: {imported: 0, total: 0}}

        for (const movie of movies) {
            newMovie = await this.createMovie(movie)
            delete newMovie.data.actors
            result.data.push(newMovie.data)
        }
        result.meta.imported = movies.length
        result.meta.total = await Movie.count()
        result.status = 1

        return result
    },
}


