const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: String,
    userAvatar: String
}, {
    timestamps: true
});

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
    reviews: [reviewSchema],
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