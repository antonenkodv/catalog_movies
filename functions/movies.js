const fs = require("fs");
const path = require("path");
module.exports = {
    formateMoviesList(file, filePath) {
        let movies = []
        let obj = {}
        const arr = file.toString().split('\n')
        for (let i = 0; i < arr.length; i++) {
            const str = arr[i]
            if (str.trim() !== '' || i === 0) {
                const key = str.split(":")[0]
                let value = str.split(":")
                if(value.length>2){
                    value.splice(0,1)
                    value = value.join(":")
                }else {
                    value = value[1]
                }
                obj[key] = value
            } else {
                movies.push(obj);
                obj = {}
            }
        }
        movies = movies.filter(movie => Object.keys(movie).length !== 0)
        movies.map(movie => {
            movie.title = movie["Title"].trim()
            movie.year = movie["Release Year"].trim()
            movie.format = movie["Format"].trim()
            movie.actors = movie["Stars"].split(',')
                .map(actor => actor.trim())
            movie.source = filePath

            const properties = ["Title", "Release Year", "Format", "Stars"]
            properties.forEach(prop => {
                delete movie[prop]
            })
            return movie
        })
        return movies
    },
    formateDate() {
        let date = new Date()
        return date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2)
    },
    createImportFile(file, date) {
        if (!fs.existsSync(`../public/movies`)) {
            fs.mkdirSync(`../public/movies`, {recursive: true})
        }

        const filePath = path.join(__dirname, `../public/movies/${date}.txt`)
        const sourceUrl = `${process.env.BASE_URL}/movies/download/${date}`
        fs.writeFile(filePath, file, (err) => {
            if (err) console.error(err)
        })
        return sourceUrl
    },
    formateResponse(response) {
    response.meta = {total: response.rows.length}
    response.data = response.rows
    response.status = 1
    delete response.rows
    delete response.count
    return response
}
}