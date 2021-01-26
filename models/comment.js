const mongoose = require('mongoose')
mongoose.models = {};
mongoose.modelSchemas = {};
const Schema = mongoose.Schema

const commentSchema = new Schema({
    body: String
})

module.exports = mongoose.model('Comment', commentSchema)