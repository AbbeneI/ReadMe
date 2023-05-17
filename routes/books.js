const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/books');


//---------- GET methods ----------
router.get('/search', bookCtrl.search);
router.post('/search/add/:id', bookCtrl.create);



module.exports = router;
