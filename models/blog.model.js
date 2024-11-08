const { Schema, model } = require('mongoose')

const blogSchemna = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    coverImageURL: {
        type: String
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps : true})

const Blog = model('Blog', blogSchemna)

module.exports = Blog