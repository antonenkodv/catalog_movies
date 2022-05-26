const {Sequelize, DataTypes} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const Actor = sequelize.define('actors', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement : true,
            unique: true,
            require: true
        },
        name: {type: DataTypes.STRING, require: true},
    })


    return Actor
}
