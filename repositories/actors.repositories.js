const {Sequelize} = require("sequelize");
const {models: { Actor}} = require('../db/init_db')

module.exports = {
     findAllActorsByIds(ids){
        return Actor.findAll({
            where: {
                id: {[Sequelize.Op.in]: ids}
            },
            raw: true
        })
    },
    createOne(conditions){
         return Actor.create(conditions)
    },
    findOne(conditions){
         return Actor.findOne(conditions)
    }
}