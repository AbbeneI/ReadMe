const mongoose = require('mongoose');
// optional shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;

const bookshelfSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    numBooks: {
        type: Number,
        min: 0,
        default: 0
    },
    books: [{
        type: Schema.Types.ObjectId,
        ref: 'Books',
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},
    {
        timestamps: true
    });

// Compile the schema into a model and export it
module.exports = mongoose.model('Bookshelf', bookshelfSchema);