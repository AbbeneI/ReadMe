const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const bookSchema = new mongoose.Schema({
    googleID: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
    },
    authors: {
        type: [String],
        required: true
    },
    publisher: {
        type: String,
    },
    publishedDate: {
        type: String,
    },
    description: {
        type: String,
    },
    pageCount: {
        type: Number,
    },
    printType: {
        type: String,
    },
    categories: {
        type: [String],
    },
    averageRating: {
        type: Number,
    },
    ratingsCount: {
        type: Number,
    },
    thumbnail: {
        type: String,
    },
    language: {
        type: String,
    },
    reviews: {
        type: [Schema.Types.ObjectId],
        ref: 'Reviews'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
    {
        timestamps: true
    })



module.exports = mongoose.model('Book', bookSchema);