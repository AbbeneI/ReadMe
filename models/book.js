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
        required: true
    },
    authors: {
        type: [String],
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    publishedDate: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    printType: {
        type: String,
        required: true
    },
    categories: {
        type: [String],
        required: true
    },
    averageRating: {
        type: Number,
        required: true
    },
    ratingsCount: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
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