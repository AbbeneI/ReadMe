const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const bookSchema = new mongoose.Schema({
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
    industryIdentifiers: {
        type: [Object],
        required: true
    },
    coverImg: {
        type: String,
    },
    numberRatings: {
        type: Number,
        required: true
    },
    averageRating: {
        type: Number,
        required: true
    },
    categories: {
        type: [String],
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
}, {
    timestamps: true
})

module.exports = mongoose.model('Book', bookSchema);