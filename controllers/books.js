const { BADRESP } = require('dns');
const Book = require('../models/book');
const Bookshelf = require('../models/bookshelf');


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

        fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerms}&maxResults=3`)
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

                        // console.log('\n--- inBooksArr: ---\n', inBooksArr, '\nsearchResults--\n', searchResults);

                        searchResults.forEach(book => {
                            inBooksArr.forEach(bookID => {
                                console.log('\ncomparing: ', bookID + ' === ' + book.id + '\n')
                                if (book.id == bookID) {
                                    book['inDB'] = true
                                }
                                else {
                                    book['inDB'] = false
                                }
                            });
                        });

                        // console.log('\n--- searchResults: ---\n', searchResults);

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
                                language: ''
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
                            newBook.inDB = bR.inDB;

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

                        Bookshelf.find({ user: req.user._id })
                            .then(bookShelves => {

                                res.render('books/search', {
                                    title: 'My Library',
                                    bookResults,
                                    searchTerms,
                                    bookshelves: bookShelves
                                });
                            })

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

        console.log('\n-------------------------\n', 'Debugging Books Controller: create()\n', req.params.id, '\nreq.body in create', req.body)

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
                    //renaming for simplicity
                    let bR = googleBooksResponse;

                    req.body.user = req.user._id

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

                    //assign cleaned up data model that matches our schema: newBook to bookResults 
                    bR = newBook;


                    console.log('\n\n--- newBook Object in Create: ---\n\n', newBook)

                    return newBook
                })
                .then(bookData => {
                    console.log('\nchecking bookData gID', bookData.googleID)

                    Book.findOne({ googleID: bookData.googleID })
                        .then(findResults => {
                            // console.log('findResults', findResults)
                            //add the book to the collection if no books currently exist with same googleID
                            if (findResults === null) {
                                // console.log('\n\n adding:', bookData.title, '\n')

                                //put the book in the bookshelf's ref array
                                Book.create(bookData)
                                    .then(bookDataTwo => {

                                        Book.findOne({ googleID: bookDataTwo.googleID }).populate('user')
                                            .then(bookDataThree => {
                                                console.log('\nbookDataThree\n', bookDataThree)

                                                Bookshelf.findOne({ name: req.body.bookshelf })
                                                    .then((b) => {
                                                        console.log('\nthis is b: \n', b);
                                                        let bcopy = b;
                                                        bcopy.books.push(bookDataThree._id);
                                                        console.log('\nthis is b after push: \n', b);
                                                        return b.updateOne(bcopy)
                                                    })
                                                    .then((btwo) => {
                                                        res.redirect('/home');
                                                    })
                                            })
                                    })
                            }
                            //otherwise, don't add and console.log error message
                            else {
                                console.log('\n\n Not added:', bookData.title, '\n')
                            }
                        })
                })

                // .then(() => {
                //     res.redirect('/home');
                // })
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
