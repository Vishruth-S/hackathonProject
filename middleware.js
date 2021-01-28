const Post = require('./models/Post')
const Comment = require('./models/Comment')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in to do that')
        return res.redirect('/login')
    }
    next()
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const post = await Post.findById(id)

    if (!post.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/posts/${id}`)
    }
    next()
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params
    const comment = await Comment.findById(commentId)

    if (!comment.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/posts/${id}`)
    }
    next()
}