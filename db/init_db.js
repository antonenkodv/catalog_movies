const Sequelize = require('sequelize')
const UserModel = require('./models/user')
const MovieModel = require('./models/movie')
const ActorModel = require('./models/actor')
const path = require("path");

require('dotenv').config({
    path: process.env.NODE_ENV === 'development' &&
        path.resolve(process.cwd(), '.env.development')
})
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,{
        dialect: 'postgres',
        host : 'localhost',
        port : Number(5432)
    })

const models = {
    User: UserModel(sequelize, Sequelize.DataTypes),
    Movie : MovieModel(sequelize , Sequelize.DataTypes),
    Actor : ActorModel(sequelize , Sequelize.DataTypes)
}

Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models)
    }
})

models.sequelize = sequelize
models.Sequelize = Sequelize

module.exports={ models , sequelize}

