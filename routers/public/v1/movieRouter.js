const router = require('express').Router();
const moviesController = require('../../../controllers/movies.controllers');
const multer = require('multer')()

router.post('/', moviesController.createMovie);
router.delete('/:id',moviesController.deleteMovie)
router.patch('/:id',moviesController.updateMovie)
router.get('/:id',moviesController.showMovie)
router.get('/',moviesController.getMoviesList)
router.post('/import',multer.any('form-data'),moviesController.importMovies)
router.get('/download/:id' , moviesController.downloadMovie)

module.exports = router;
