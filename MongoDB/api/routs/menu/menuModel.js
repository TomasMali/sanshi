
// this is a module DAO for Users
const mongoose = require('mongoose')

const menuSchema = mongoose.Schema({
 //   _id : mongoose.Schema.Types.ObjectId,
   menuId: Number,
    name: String,
    portion: Number,
    price: Number
    
})

module.exports = mongoose.model('Menu', menuSchema) 