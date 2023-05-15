const express = require('express');
const router = express.Router();
const bookshelvesCtrl = require('../controllers/bookshelves');


//---------- GET methods ----------
router.get('/home', bookshelvesCtrl.index);
router.get('/bookshelves/:id', bookshelvesCtrl.detail);
router.get('/bookshelves/new', bookshelvesCtrl.newBookshelf);

//---------- Other methods ----------
router.post('/bookshelves/new', bookshelvesCtrl.create);
router.patch('/bookshelves/:id', bookshelvesCtrl.edit);



module.exports = router;
