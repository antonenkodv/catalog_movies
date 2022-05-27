const {Sequelize, DataTypes} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true,
            require: true
        },
        name: {type: DataTypes.STRING, require: true},
        email: {
            type: DataTypes.STRING,
            unique: true,
            require: true
        },
        password: {type: DataTypes.STRING, require: true},
    })

    return User
}