const moviesRepositories = require('../repositories/movies.repositories')
const {models: {Movie}} = require('../db/init_db')
const {formateMoviesList,formateDate,createImportFile,formateResponse} = require('../functions/movies')

module.exports = {
    createMovie({title, year, format, actors}) {
        return moviesRepositories.createMovie({title, year, format, actors})
    },
    deleteMovie({id}) {
        return moviesRepositories.deleteMovie({id})
    },
    updateMovie({id, data}) {
        return moviesRepositories.updateMovie({id, data})
    },
    showMovie({id}) {
        return moviesRepositories.showMovie({id})
    },
    async getMoviesList(queryData) {
        const response = await moviesRepositories.getMoviesList(queryData)
        return formateResponse(response)
    },
    async importMovies(fileBuffer) {

        const date = formateDate()
        const filePath = await createImportFile(fileBuffer, date)
        movies = formateMoviesList(fileBuffer, filePath)
        let  result = {data : [] , meta : { imported : 0 , total : 0}}

        for (const movie of movies) {
        newMovie =  await moviesRepositories.createMovie(movie)
            console.log(result)
            delete newMovie.data.actors

            result.data.push(newMovie.data)
        }
        result.meta.imported = movies.length
        result.meta.total = await Movie.count()
        result.status = 1

        return result
    }
}

