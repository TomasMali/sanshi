
// this is a module DAO for Users
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
 //   _id : mongoose.Schema.Types.ObjectId,
   telegramId: Number,
    name: String,
    surname: String,
    admin: Boolean,
    launch: Boolean,
    table: String,
    menus: [{ 
      tableName:String,                                                                    
      menuId: Number,
      quantity: Number,
      arrived: Number,
      name: String,
      portion: Number,
      price: Number
    }]
    
})

module.exports = mongoose.model('User', userSchema) 