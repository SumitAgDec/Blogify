const { Router } = require('express');
const User = require('../models/user.model');
const Blog = require('../models/blog.model');
const multer = require('multer');
const path = require('path');
const Comment = require('../models/comment.model');
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
      const filename = `${Date.now()}-${file.originalname}`
      cb(null, filename)
    }
  })
  
const upload = multer({ storage: storage })

router.get('/add-new', (req, res)=>{
    return res.render("addBlog", {
        user: req.user,
    })
})

router.get('/:id', async (req, res)=>{
    const blog = await Blog.findById(req.params.id).populate('createdBy')
    const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy')
    return res.render("viewBlog", {
        user: req.user,
        blog,
        comments
    })
})

router.post('/comment/:blogId', async (req, res)=>{
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id
    });
    return res.redirect(`/blog/${req.params.blogId}`)
})

router.post('/add-new', upload.single('coverImageURL'), async (req, res)=>{
    const {title, content, coverImageURL} = req.body
    const blog = await Blog.create({
        title,
        content,
        coverImageURL: `/uploads/${req.file.filename}`,
        createdBy: req.user._id
    })
    console.log(req.body);
    return res.redirect(`/blog/${blog._id}`)
})

module.exports = router