const Bookshelf = require('../models/bookshelf');
// const Performer = require('../models/performer');

module.exports = {
    index,
    newBookshelf,
    create
};

async function index(req, res) {
    Bookshelf.find({ user: req.user._id })
        .then(bookshelves => {
            res.render('bookshelf/index', {
                title: 'My Library',
                bookshelves
            });
        })
        .catch(next)
}

async function newBookshelf(req, res) {
    // const movies = await Movie.find({});
    res.render('bookshelf/new', {
        title: 'My New Bookshelf'
    });
}

async function create(req, res) {
    console.log("\n-------------------------\n", "Debugging Controller: create()\n", req.body)
    for (let key in req.body) {
        if (req.body[key] === '') delete req.body[key];
    }
    try {
        console.log('\nafter changes: ', req.body);
        await Bookshelf.create(req.body);

        res.redirect('/home');
    } catch (err) {
        // Typically some sort of validation error
        console.log(err);
        res.render('/error', { errorMsg: err.message });
    }
}