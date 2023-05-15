

const mongoose = require('mongoose');
// optional shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;

// const reviewSchema = new Schema({
//   content: {
//     type: String,
//     required: true
//   },
//   rating: {
//     type: Number,
//     min: 1,
//     max: 5,
//     default: 5
//   },
//   // Don't forget to add the comma above then
//   // add the 3 new properties below
//   user: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   userName: String,
//   userAvatar: String

// }, {
//   timestamps: true
// });