const express = require('express');
const router = express.Router();
const bookshelvesCtrl = require('../controllers/bookshelves');


//---------- GET methods ----------
// GET /movies
router.get('/home', bookshelvesCtrl.index);

// GET /movies/new
router.get('/bookshelves/new', bookshelvesCtrl.newBookshelf);

//---------- Other methods ----------
router.post('/bookshelves/new', bookshelvesCtrl.create);




module.exports = router;
