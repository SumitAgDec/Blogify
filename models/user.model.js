const { Schema, model } = require('mongoose')
const { createHmac, randomBytes } = require('crypto')
const { createUserToken } = require('../services/authentication')

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: "/images/60111.jpg",
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
})

userSchema.pre("save", function(next){
    const user = this
    if (!user.isModified('password')) return next();
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;
    next()
})

// Static method for password matching
userSchema.static("matchPasswordAndGenerateToken", async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('User not found');

    const salt = user.salt;
    const storedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt).update(password).digest("hex");

    if (storedPassword !== userProvidedHash) throw new Error('Incorrect Password');

    const token = createUserToken(user)

    return token;
});

const User = model('User', userSchema)

module.exports = User