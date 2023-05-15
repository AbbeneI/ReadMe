const Bookshelf = require('../models/bookshelf');
// const Performer = require('../models/performer');

module.exports = {
    index,
    newBookshelf,
    create,
    detail,
    edit,
};

async function index(req, res, next) {
    console.log('\n checking user:', req.user, '\n')
    if (req.user) {
        await Bookshelf.find({ user: req.user._id })
            .then(bookshelves => {
                res.render('bookshelf/index', {
                    title: 'My Library',
                    bookshelves
                });
            })
            .catch(next)
    }
    else {
        res.render('bookshelf/index', {
            title: 'My Library',
        });
    }
}

async function newBookshelf(req, res, next) {
    console.log('\n checking user:', req.user, '\n')

    // const movies = await Movie.find({});
    res.render('bookshelf/new', {
        title: 'My New Bookshelf'
    });
}

async function create(req, res, next) {
    console.log('\n-------------------------\n', 'Debugging Controller: create()\n', req.body)

    for (let key in req.body) {
        if (req.body[key] === '') delete req.body[key];
    }
    try {
        req.body.user = req.user._id
        console.log('\nafter changes: ', req.body);
        await Bookshelf.create(req.body);

        res.redirect('/home');
    } catch (err) {
        // Typically some sort of validation error
        console.log(err);
        res.render('/error', { errorMsg: err.message });
    }
}

async function detail(req, res, next) {
    Bookshelf.findById(req.params.id).then(bookshelf => {
        console.log('\n----------- Debugging Bookshelves Controller: detail() -----------\n', 'bookshelf', bookshelf, '\n');

        let titleString = `Edit ${bookshelf.name}`;

        res.render('bookshelf/detail', {
            bookshelf
        });
    }
    )
    // bookShelf = bookShelf[0];

}

async function edit(req, res, next) {

    Bookshelf.findById(req.params.id)
        .then((bookshelf) => {
            console.log('\n----------- Debugging Bookshelves Controller: edit() -----------\n', 'bookshelf', bookshelf, '\nreq.body: ', req.body);

            if (!bookshelf.user.equals(req.user._id)) throw new Error('Unauthorized')
            return bookshelf.updateOne(req.body)
        })
        .then((bookshelf) => {
            console.log('\n----------- Debugging Bookshelves Controller: edit() -----------\n', 'bookshelf', bookshelf, '\nreq.body: ', req.body);

            res.redirect(`/bookshelves/${req.params.id}`)
        })
        .catch(next)
}