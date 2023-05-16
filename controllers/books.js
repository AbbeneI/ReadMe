const Book = require('../models/book');

module.exports = {
    search
};

async function search(req, res, next) {
    if (req.user) {
        console.log('\n checking user:', req.user, '\n')
        let searchTerms = 'The Priory of the Orange Tree';

        fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerms}&maxResults=3`)
            .then((res) => res.json())
            .then(googleBooksResponse => {

                console.log('\n--- GoogleBooksResponse: ---\n', googleBooksResponse);
                let bookResults = googleBooksResponse.items;
                
                res.render('books/search', {
                    title: 'My Library',
                    bookResults
                });
            })
            .catch(next)

        // console.log('\nbookResults:\n', bookResults, '\nmyResults', myResults);

        // res.render('books/search', {
        //     title: 'My Library',
        //     bookResults
        // });

        // res.render('books/search', {
        //     title: 'My Library',
        //     bookResults
        // });

        // await Bookshelf.find({ user: req.user._id })
        //     .then(bookshelves => {
        //         res.render('bookshelf/index', {
        //             title: 'My Library',
        //             bookshelves
        //         });
        //     })
        //     .catch(next)
    }
    else {
        res.redirect('/');
    }
}