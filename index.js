const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')



const postRoutes = require('./routes/posts')
const commentRoutes = require('./routes/comments')

mongoose.connect("mongodb://localhost:27017/temp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
    console.log("Database connected")
})

const PORT = process.env.PORT || 5000

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.get('/', (req, res) => {
    res.render('Home')
})


app.use('/posts/', postRoutes)
app.use('/posts/:id/comments/', commentRoutes)

// app.get('/makepost', async (req, res) => {
//     const newPost = new Post({ title: "Test Post", description: "Test content ok" })
//     await newPost.save()
//     res.send(newPost)
// })

app.listen(PORT, () => {
    console.log(`Sever running on http://localhost:${PORT}`)
})