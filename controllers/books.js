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
        let newBook = null;


        for (let key in req.body) {
            if (req.body[key] === '') delete req.body[key];
        }
        try {
            fetch(`https://books.googleapis.com/books/v1/volumes/${id}`)
                .then((res) => res.json())
                .then(googleBooksResponse => {
                    console.log('\n\n--- GoogleBooksResponse: ---\n', googleBooksResponse);
                
                    req.body.user = req.user._id

                    newBook = {
                        googleID: googleBooksResponse.id,
                        title: googleBooksResponse.volumeInfo.title,
                        subtitle: googleBooksResponse.volumeInfo.subtitle,
                        authors: googleBooksResponse.volumeInfo.authors,
                        publisher: googleBooksResponse.volumeInfo.publisher,
                        publishedDate: googleBooksResponse.volumeInfo.publishedDate,
                        description: googleBooksResponse.volumeInfo.publishedDate,
                        pageCount: googleBooksResponse.volumeInfo.pageCount,
                        printType: googleBooksResponse.volumeInfo.printType,
                        categories: googleBooksResponse.volumeInfo.categories,
                        averageRating: googleBooksResponse.volumeInfo.averageRating,
                        ratingsCount: googleBooksResponse.volumeInfo.ratingsCount,
                        thumbnail: googleBooksResponse.volumeInfo.imageLinks.thumbnail,
                        language: googleBooksResponse.volumeInfo.language,
                        user: req.user._id
                    }

                    console.log('\n\n--- newBook Object: ---\n\n',newBook)

                    return newBook
                })
                .then(bookData => {
                    if(Book.findOne({googleID : bookData.googleID}) === {}){
                        console.log('\n\n adding:', bookData.title,'\n')
                       return Book.create(bookData)   
                        .then(bookDataTwo => {

                            Book.findOne({googleID : bookDataTwo.googleID}).populate('user');
                        })
                    }
                    else{
                        console.log('\n\n Not added:', bookData.title,'\n')
                    }
                })
                .then(() => {
                    res.redirect('/search');
                })
                .catch(next)




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