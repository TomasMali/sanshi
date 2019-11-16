
// this is a module DAO for Users
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
 //   _id : mongoose.Schema.Types.ObjectId,
   telegramId: Number,
    name: String,
    surname: String,
    admin: Boolean,
    launch: Boolean,
    table: String
    
})

module.exports = mongoose.model('User', userSchema) 