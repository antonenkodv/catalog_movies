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
    }
}