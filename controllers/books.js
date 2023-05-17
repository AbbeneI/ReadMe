const Book = require('../models/book');

module.exports = {
    search,
    create
};

async function search(req, res, next) {
    if (req.user) {
        console.log('\n checking user:', req.user, '\n')
        let searchTerms = 'Good Omens';

        fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerms}&maxResults=3`)
            .then((res) => res.json())
            .then(googleBooksResponse => {
                console.log('\n--- GoogleBooksResponse: ---\n', googleBooksResponse);
                let bookResults = googleBooksResponse.items;
                console.log('\n--- volumeInfo: ---\n', bookResults[0].volumeInfo);

                res.render('books/search', {
                    title: 'My Library',
                    bookResults
                });
            })
            .catch(next)
    }
    else {
        res.redirect('/');
    }
}

async function create(req, res, next) {
    if (req.user) {

        console.log('\n-------------------------\n', 'Debugging Books Controller: create()\n', req.params.id)

        let id = req.params.id;
        let bookResult = null;


        for (let key in req.body) {
            if (req.body[key] === '') delete req.body[key];
        }
        try {
            // https://books.googleapis.com/books/v1/volumes/aVfAAgAAQBAJ
            fetch(`https://books.googleapis.com/books/v1/volumes/${id}`)
                .then((res) => res.json())
                .then(googleBooksResponse => {
                    console.log('\n--- GoogleBooksResponse: ---\n', googleBooksResponse);

                    bookResult = googleBooksResponse;
                    // console.log('\n--- volumeInfo: ---\n', bookResult);
                    res.redirect('/home');
                })
                .catch(next)

            let newBook = {
                title: bookResult.volumeInfo.title,
                subtitle: bookResult.volumeInfo.subtitle,
                authors: bookResult.volumeInfo.authors,
                publisher: volumeInfo.publisher,
                publishedDate: volumeInfo.publishedDate,
                description: volumeInfo.description,

            }

            console.log('\nnewBook to be created:\n',newBook)

            req.body.user = req.user._id
            // await Book.create(bookResult);

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