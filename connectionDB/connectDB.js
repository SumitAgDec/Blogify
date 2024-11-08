const mongoose = require('mongoose')

async function connectToMonogDB(url){
    try {
        await mongoose.connect(url)
        .then(()=> console.log('MongoDB connected'))
        .catch((error)=> console.log("Error: ", error))
    } catch (error) {
        console.log('Error: ', error)
    }
}

module.exports = {
    connectToMonogDB
}