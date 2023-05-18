const Book = require('../models/book');

module.exports = {
    search,
    create,
    searchStart
};

async function searchStart(req, res, next) {
    if (req.user) {

        console.log('\n checking user:', req.user, '\nreq.params', req.params, '\nreq.body', req.body);
        res.render('books/index', {

        });
    }
    else {
        res.redirect('/');

    }


}

async function search(req, res, next) {
    if (req.user) {

        let searchTerms = req.body.search;
        // if(searchTerms === undefined){
        //     searchTerms = 
        // }

        console.log('\n\nsearch terms:"' + searchTerms + '"');

        fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerms}&maxResults=20`)
            .then((res) => res.json())
            .then(googleBooksResponse => {
                // console.log('\n--- GoogleBooksResponse: ---\n', googleBooksResponse);
                const searchResults = googleBooksResponse.items;

                Book.find({})
                    .then(allBooks => {

                        let inBooksArr = [];
                        // console.log('\n--- allBooks: ---\n', allBooks);
                        allBooks.forEach(b => {
                            inBooksArr.push(b.googleID)
                        })

                        console.log('\n--- inBooksArr: ---\n', inBooksArr, '\nsearchResults--\n', searchResults);

                        searchResults.forEach(book => {
                            inBooksArr.forEach(bookID => {
                                if (book.id === bookID) {
                                    book['inDB'] = true
                                }
                                else {
                                    book['inDB'] = false
                                }
                            });
                        });

                        console.log('\n--- searchResults: ---\n', searchResults);

                        return searchResults;
                    })
                    .then(bookResults => {
                        // console.log('\n\n------------------------------------\n')

                        bookResults.forEach((bR, idx) => {
                            // console.log('\n\n------------------------------------\n')

                            // console.log('bR:', bR);

                            //cleaning data of undefined values, including inside objects and arrays
                            let volInfo = bR.volumeInfo;
                            for (let property in volInfo) {
                                // console.log(`\nproperty: ${property}\nvalue: ${volInfo[property]}\ntypeof ${typeof (volInfo[property])} `)
                                if (typeof (volInfo[property]) === 'undefined') {
                                    volInfo[property] = '';
                                }
                                else if (typeof (volInfo[property]) === 'array') {
                                    for (let i = 0; i < volInfo[property].length; i++) {
                                        if (typeof (volInfo[property][i]) === 'undefined') {
                                            volInfo[property][i] = '';
                                        }
                                    }
                                }
                                else if (typeof (volInfo[property]) === 'object') {
                                    // console.log('fixing object value...\n-----\n')
                                    for (let prop in volInfo[property]) {
                                        // console.log(`prop before fix: ${prop}`)
                                        if (typeof (prop) === 'undefined') {
                                            prop = '';
                                        }
                                        // console.log(`prop after fix: ${prop}`)

                                    }
                                }
                            }

                            let newBook = {
                                title: '',
                                subtitle: '',
                                authors: '',
                                publisher: '',
                                publishedDate: '',
                                description: '',
                                pageCount: '',
                                printType: '',
                                categories: '',
                                averageRating: '',
                                ratingsCount: '',
                                language: '',
                            }

                            for (let prop in newBook) {
                                if ((bR.volumeInfo.hasOwnProperty(prop)) && (typeof (bR.volumeInfo[prop]) !== 'undefined')) {
                                    newBook[prop] = bR.volumeInfo[prop]
                                }
                                else {
                                    newBook[prop] = '';
                                }
                            }

                            //add user and Google ID reference
                            newBook.user = req.user._id
                            newBook.googleID = bR.id;

                            if ((bR.volumeInfo.hasOwnProperty('imageLinks')) && (typeof (bR.volumeInfo.imageLinks) !== 'undefined')) {
                                if (bR.volumeInfo.imageLinks.hasOwnProperty('thumbnail') && typeof (bR.volumeInfo.imageLinks.thumbnail) !== 'undefined') {
                                    newBook.thumbnail = bR.volumeInfo.imageLinks.thumbnail;
                                }
                                else if (bR.volumeInfo.imageLinks.hasOwnProperty('smallThumbnail') && typeof (bR.volumeInfo.imageLinks.smallThumbnail) !== 'undefined') {
                                    newBook.thumbnail = bR.volumeInfo.imageLinks.smallThumbnail;
                                }
                                else if (bR.volumeInfo.imageLinks.hasOwnProperty('small') && typeof (bR.volumeInfo.imageLinks.small) !== 'undefined') {
                                    newBook.thumbnail = bR.volumeInfo.imageLinks.small;
                                }
                                else if (bR.volumeInfo.imageLinks.hasOwnProperty('medium') && typeof (bR.volumeInfo.imageLinks.medium) !== 'undefined') {
                                    newBook.thumbnail = bR.volumeInfo.imageLinks.medium;
                                }
                                else if (bR.volumeInfo.imageLinks.hasOwnProperty('large') && typeof (bR.volumeInfo.imageLinks.large) !== 'undefined') {
                                    newBook.thumbnail = bR.volumeInfo.imageLinks.large;
                                }
                            }
                            else {
                                newBook.thumbnail = '';
                            }

                            //assign bR to cleaned up data model that matches our schema: newBook
                            bookResults[idx] = newBook;

                            // console.log('\nbookResults[idx]: ', bookResults[idx])
                            // console.log('\n------------------------------------\n')
                        });

                        // console.log('bR authors', bRauthors, '\nbR categories', bRcategories)
                        // console.log('bookResults in Controller\n', bookResults)

                        res.render('books/search', {
                            title: 'My Library',
                            bookResults,
                            searchTerms,
                        });
                    })

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



                    console.log('\n\n--- newBook Object: ---\n\n', newBook)

                    return newBook
                })
                .then(bookData => {
                    console.log('\nchecking bookData gID', bookData.googleID)

                    Book.findOne({ googleID: bookData.googleID })
                        .then(findResults => {
                            console.log('findResults', findResults)

                            if (findResults === null) {

                                console.log('\n\n adding:', bookData.title, '\n')

                                return Book.create(bookData)
                                    .then(bookDataTwo => {
                                        Book.findOne({ googleID: bookDataTwo.googleID }).populate('user');
                                    })
                            }
                            else {
                                console.log('\n\n Not added:', bookData.title, '\n')
                            }

                        })

                })
                .then(() => {
                    res.redirect('/home');
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



                            // function assignProperty(p) {
                            //     if (typeof (p) !== 'undefined') {
                            //         return p;
                            //     }
                            //     else {
                            //         return '';
                            //     }
                            // }


                            // let newBook = {

                            //     googleID: assignProperty(bR.id),
                            //     title: assignProperty(bR.volumeInfo.title),
                            //     subtitle: assignProperty(bR.volumeInfo.subtitle),
                            //     authors: assignProperty(bR.volumeInfo.authors),
                            //     publisher: assignProperty(bR.volumeInfo.publisher),
                            //     publishedDate: assignProperty(bR.volumeInfo.publishedDate),
                            //     description: assignProperty(bR.volumeInfo.publishedDate),
                            //     pageCount: assignProperty(bR.volumeInfo.pageCount),
                            //     printType: assignProperty(bR.volumeInfo.printType),
                            //     categories: assignProperty(bR.volumeInfo.categories),
                            //     averageRating: assignProperty(bR.volumeInfo.averageRating),
                            //     ratingsCount: assignProperty(bR.volumeInfo.ratingsCount),
                            //     thumbnail: assignProperty(bR.volumeInfo.imageLinks.thumbnail),
                            //     language: assignProperty(bR.volumeInfo.language),
                            //     user: assignProperty(req.user._id)
                            // }