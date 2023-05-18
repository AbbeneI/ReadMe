const Bookshelf = require('../models/bookshelf');
const Book = require('../models/book');


module.exports = {
    index,
    newBookshelf,
    create,
    detail,
    edit,
    deleteBookshelf,
};

async function index(req, res, next) {
    // console.log('\n checking user:', req.user, '\n')
    if (req.user) {
        Bookshelf.find({ user: req.user._id })
            .then(bookShelves => {
                Book.find({ user: req.user.id })
                    .then(books => {
                        // console.log('\n\n------bookshelves in index----\n', arr[0], '\n------books in index----\n', arr[1])
                        res.render('bookshelf/index', {
                            title: 'My Library',
                            bookshelves: bookShelves,
                            books
                        });
                    })


            })

            .catch(next)
    }
    else {
        res.redirect('/');
    }
}

async function newBookshelf(req, res, next) {
    if (req.user) {
        res.render('bookshelf/new', {
            title: 'My New Bookshelf'
        });
    }
    else {
        res.redirect('/');
    }
}

async function create(req, res, next) {
    if (req.user) {

        console.log('\n-------------------------\n', 'Debugging Controller: create()\n', req.body)
        console.log('\n checking user:', req.user, '\n')

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
    else {
        res.redirect('/');
    }

}

async function detail(req, res, next) {
    if (req.user) {

        Bookshelf.findById(req.params.id)
            .then(bookshelf => {
                // console.log('\n----------- Debugging Bookshelves Controller: detail() -----------\n', 'bookshelf', bookshelf, '\n');

                let books = Book.find({})
               return [bookshelf,books]
            })
            .then((arr) => {

                res.render('bookshelf/detail', {
                    bookshelf: arr[0],
                    books: arr[1]
                });
            })
            .catch(next)
    }
    else {
        res.redirect('/');
    }
}

async function edit(req, res, next) {
    Bookshelf.findById(req.params.id)
        .then((bookshelf) => {
            if (!bookshelf.user.equals(req.user._id)) throw new Error('Unauthorized')
            return bookshelf.updateOne(req.body)
        })
        .then((bookshelf) => {
            res.redirect(`/bookshelf/${req.params.id}`)
        })
        .catch(next)
}

async function deleteBookshelf(req, res, next) {
    Bookshelf.findById(req.params.id)
        .then(bookshelf => {
            console.log('\n----------- Debugging Bookshelves Controller: deleteBookshelf() -----------\n', 'bookshelf', bookshelf, '\n');

            if (!bookshelf.user.equals(req.user._id)) throw new Error('Unauthorized')
            return bookshelf.deleteOne()
        })
        .then(() => res.redirect('/home'))
        .catch(next)
}

