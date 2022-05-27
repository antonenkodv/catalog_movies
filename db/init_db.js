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
    process.env.POSTGRES_NAME ,
    process.env.POSTGRES_USERNAME ,
    process.env.POSTGRES_PASSWORD ,{
        dialect: 'postgres',
        host : process.env.POSTGRES_HOST,
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

