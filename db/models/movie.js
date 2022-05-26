const {Sequelize, DataTypes} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const Movie = sequelize.define('movies', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement : true,
            unique: true,
            require: true
        },
        title: {type: DataTypes.STRING, require: true},
        year: {type: DataTypes.CHAR(4), require: true},
        format: {type: DataTypes.STRING, require: true},
        actors: {type: DataTypes.ARRAY(DataTypes.TEXT), require: true}
    })

    return Movie
}
