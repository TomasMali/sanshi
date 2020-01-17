
// this is a module DAO for Users
const mongoose = require('mongoose')

const visitingSchema = mongoose.Schema({
 //   _id : mongoose.Schema.Types.ObjectId,
   PIVA: String,
    visitTot: Number,
    DOCS: [{
      name: String,
      dataInsert: String
    }]
    
})

module.exports = mongoose.model('Visiting', visitingSchema) 