const mongoose = require('mongoose')
mongoose.models = {};
// mongoose.modelSchemas = {};
const Schema = mongoose.Schema

const commentSchema = new Schema({
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Comment', commentSchema)