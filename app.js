require('dotenv').config();
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const { connectToMonogDB } = require('./connectionDB/connectDB');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const Blog = require('./models/blog.model');


const app = express()
const port = process.env.PORT || 10000;

const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');

//Connect DB
connectToMonogDB(process.env.DB_URL)

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve("./public")))

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.get('/', async (req, res)=>{
    const allBlog = await Blog.find({})
    res.render('home', {
        user: req.user,
        blogs: allBlog,
    })
})

app.use('/user', userRouter)
app.use('/blog', blogRouter)

app.listen(port,'0.0.0.0', ()=> console.log(`Server is running at port: ${port}`))