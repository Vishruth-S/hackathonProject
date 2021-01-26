const mongoose = require('mongoose')
const Comment = require('./comment')
const Schema = mongoose.Schema

const postSchema = new Schema({
    title: String,
    image: String,
    description: String,
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
})

postSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model("Post", postSchema)