const express = require('express')
const router = express.Router({ mergeParams: true })

const Post = require('../models/Post')
const Comment = require('../models/Comment')

router.post('/', async (req, res) => {
    const post = await Post.findById(req.params.id)
    const comment = new Comment(req.body.comment)
    post.comments.push(comment)
    await comment.save()
    await post.save()
    req.flash('success', 'Comment posted successfully')
    res.redirect(`/posts/${post._id}`)
})

router.delete('/:commentId', async (req, res) => {
    const { id, commentId } = req.params
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } })
    await Comment.findByIdAndDelete(commentId)
    req.flash('success', 'Comment was deleted successfully')
    res.redirect(`/posts/${id}`)
})

module.exports = router
