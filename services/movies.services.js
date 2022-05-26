const moviesRepositories = require('../repositories/movies.repositories')

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
}
function formateResponse(response){
    response.meta = { total : response.rows.length}
    response.data = response.rows
    response.status = 1
    delete response.rows
    delete response.count
    return response
}