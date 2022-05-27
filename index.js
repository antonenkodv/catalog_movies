const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const path = require('path')
const app = express()
const {models} = require("./db/init_db")
const routers = require('./routers')

require('dotenv').config({
    path: process.env.NODE_ENV === 'development' &&
        path.resolve(process.cwd(), '.env.development')
})

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))

app.use(routers)

app.listen(PORT || 8000, (c) => {
    console.log(`Server running on port ${PORT}`)
})

models.sequelize.sync()
    .then(() => console.log('Launched successfully'))
    .catch(err => console.log('[ERROR]', err))