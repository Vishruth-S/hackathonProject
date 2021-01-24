const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

const Post = require('./models/Post')

mongoose.connect("mongodb://localhost:27017/temp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
    console.log("Database connected")
})

const PORT = process.env.PORT || 5000

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('Home')
})

app.get('/posts', async (req, res) => {
    const posts = await Post.find({})
    res.render('posts/index', { posts })
})

app.get('/posts/new', (req, res) => {
    res.render("posts/new")
})

app.post('/posts', async (req, res) => {
    const post = new Post(req.body.post)
    await post.save()
    res.redirect(`/posts/${post._id}`)
})

app.get('/posts/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('posts/show', { post })
})

app.get('/posts/:id/edit', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('posts/edit', { post })
})

app.put('/posts/:id', async (req, res) => {
    const { id } = req.params
    const post = await Post.findByIdAndUpdate(id, { ...req.body.post })
    res.redirect(`/posts/${post._id}`)
})

app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params
    await Post.findByIdAndDelete(id)
    res.redirect('/posts')
})

// app.get('/makepost', async (req, res) => {
//     const newPost = new Post({ title: "Test Post", description: "Test content ok" })
//     await newPost.save()
//     res.send(newPost)
// })

app.listen(PORT, () => {
    console.log(`Sever running on http://localhost:${PORT}`)
})