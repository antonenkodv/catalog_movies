const {models: {Movie}} = require('../db/init_db')


module.exports = {
    findOne(conditions) {
        return Movie.findOne(conditions)
    },
    createOne(conditions) {
        return Movie.create(conditions)
    },
    destroyOne(conditions) {
        return Movie.destroy(conditions)
    },
    updateOne(conditions , where) {
        return Movie.update(conditions,where)
    },
    findAndCount(conditions){
        return Movie.findAndCountAll(conditions)
    },
}