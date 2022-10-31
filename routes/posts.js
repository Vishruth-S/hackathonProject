const express = require('express')
const router = express.Router()
const { isLoggedIn, isAuthor } = require('../middleware')

const Post = require('../models/Post')


router.get('/', async (req, res) => {
    const posts = await Post.find({})
    res.render('posts/index', { posts })
})

router.get('/new', isLoggedIn, (req, res) => {
    res.render('posts/new')
})


router.post('/', isLoggedIn, async (req, res) => {
    const post = new Post(req.body.post)
    post.author = req.user._id
    await post.save()
    req.flash('success', 'Sucessfully made a new Post!')
    res.redirect(`/posts/${post._id}`)
})

router.get('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!post) {
        req.flash('error', 'Cannot find that post')
        return res.redirect('/posts/')
    }
    res.render('posts/show', { post })
})


router.get('/:id/edit', isLoggedIn, isAuthor, async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        req.flash('error', 'Cannot find that post')
        return res.redirect('/posts/')
    }
    res.render('posts/edit', { post })
})


router.put('/:id', isLoggedIn, isAuthor, async (req, res) => {
    const { id } = req.params
    const post = await Post.findByIdAndUpdate(id, { ...req.body.post })
    req.flash('success', 'Sucessfully updated!')
    res.redirect(`/posts/${post._id}`)
})

router.delete('/:id', isLoggedIn, isAuthor, async (req, res) => {
    const { id } = req.params
    await Post.findByIdAndDelete(id)
    req.flash('success', 'Post was deleted successfully')
    res.redirect('/posts')
})

module.exports = router
