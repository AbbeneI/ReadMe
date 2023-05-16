const express = require('express');
const router = express.Router();
const bookshelvesCtrl = require('../controllers/bookshelves');


//---------- GET methods ----------
router.get('/home', bookshelvesCtrl.index);
router.get('/bookshelf/new', bookshelvesCtrl.newBookshelf);
router.get('/bookshelf/:id', bookshelvesCtrl.detail);


//---------- Other methods ----------
router.post('/bookshelf', bookshelvesCtrl.create);
router.patch('/bookshelf/:id', bookshelvesCtrl.edit);
router.delete('/bookshelf/:id', bookshelvesCtrl.deleteBookshelf);


module.exports = router;
