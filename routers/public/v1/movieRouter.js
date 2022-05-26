const router = require('express').Router();
const moviesController = require('../../../controllers/movies.controllers');

router.post('/', moviesController.createMovie);
router.delete('/:id',moviesController.deleteMovie)
router.patch('/:id',moviesController.updateMovie)
router.get('/:id',moviesController.showMovie)
router.get('/',moviesController.getMoviesList)
module.exports = router;
