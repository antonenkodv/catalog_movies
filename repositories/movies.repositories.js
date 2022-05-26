const {models: {Movie, Actor}, sequelize} = require('../db/init_db')
const {errorHandler} = require("../validation");
const actorsRepositories = require("./actors.repositories")
const {Sequelize} = require("sequelize");

module.exports = {
    async createMovie({title, year, format, actors,source=null}) {
        try {
            const newMovie = {title, year, format, actors,source}
            let unexistedIds = []
            let existedIds = []
            for (const name of actors) {
                const actor = await Actor.findOne({where: {name}})
                if (actor) existedIds.push(actor.id)
                else {
                    unexistedIds.push(Actor.create({name}))
                }
            }
            const t = await sequelize.transaction();
            if (unexistedIds.length) {
                unexistedIds = await Promise.all(unexistedIds)
                unexistedIds = unexistedIds.map(actor => actor.dataValues.id)
            }
            let {dataValues} = await Movie.create({...newMovie, actors: [...existedIds, ...unexistedIds]})
            await t.commit();

            dataValues.actors = await actorsRepositories.findAllActorsByIds([...existedIds, ...unexistedIds])
            return dataValues
        } catch (err) {
            await t.rollback();
            errorHandler("Something went wrong", 500)
        }
    },
    async deleteMovie({id}) {
        try {
            const movie = await Movie.findOne({where: {id}, raw: true})
            if (movie) {
                await Movie.destroy({where: {id}})
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
                const actor = await Actor.findOne({where: {name}})
                if (actor) existedIds.push(actor.id)
                else {
                    unexistedIds.push(Actor.create({name}))
                }
            }
            const t = await sequelize.transaction();
            if (unexistedIds.length) {
                unexistedIds = await Promise.all(unexistedIds)
                unexistedIds = unexistedIds.map(actor => actor.dataValues.id)
            }
            await Movie.update({title, year, format, actors: [...existedIds, ...unexistedIds]}, {where: {id}})
            await t.commit();

            const result = await Movie.findOne({where: {id}, attributes: ["id", "title", "year", "format"], raw: true})
            result.actors = await actorsRepositories.findAllActorsByIds([...existedIds, ...unexistedIds])
            return result
        } catch (err) {
            await t.rollback();
            errorHandler("Something went wrong", 500)
        }
    },
    async showMovie({id}) {
        try {
            const movie = await Movie.findOne({where: {id}, raw: true})
            if (movie) {
                movie.actors = await actorsRepositories.findAllActorsByIds(movie.actors)
                return movie
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
        try {
            if (searchParam) {
                if (searchParam.name === "actor") {
                    const actor = await Actor.findOne({
                        where: {name: {[Sequelize.Op.like]: `%${searchParam.value}%`}},
                        raw: true
                    })

                    if (actor) {
                        const {id: actorId} = actor
                        return Movie.findAndCountAll({
                            where: {
                                actors: {[Sequelize.Op.contains]: [actorId]}
                            },
                            attributes: ["id", "title", "year", "format", "createdAt", "updatedAt"],
                            limit,
                            offset,
                            raw: true
                        })

                    } else {
                        return {message: "No such actor"}
                    }
                }
                if (searchParam.name === 'title') {
                    return Movie.findAndCountAll({
                        where: {title: {[Sequelize.Op.like]: `%${searchParam.value}%`}},
                        attributes: ["id", "title", "year", "format", "createdAt", "updatedAt"],
                        order: [[sort, order]],
                        limit,
                        offset,
                        raw: true
                    })
                }
                if (searchParam.name === 'search') {
                    const actor = await Actor.findOne({
                        where: {name: {[Sequelize.Op.like]: `%${searchParam.value}%`}},
                        raw: true
                    })
                    if (actor) {
                        const {id: actorId} = actor
                        return Movie.findAndCountAll({
                            where:
                                {
                                    actors: {[Sequelize.Op.contains]: [actorId]},
                                    title : {[Sequelize.Op.like]: `%${searchParam.value}%`},
                                },
                            attributes: ["id", "title", "year", "format", "createdAt", "updatedAt"],
                            limit,
                            offset,
                            raw: true
                        })

                    } else {
                        return {message: "No such actor"}
                    }
                }

            }


            return Movie.findAndCountAll({
                attributes: ["id", "title", "year", "format", "createdAt", "updatedAt"],
                order: [[sort, order]],
                limit,
                offset,
                raw: true
            })
        } catch (err) {
            console.log(err)
            errorHandler("Something went wrong", 500)
        }
    },
}