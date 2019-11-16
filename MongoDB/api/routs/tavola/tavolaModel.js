
// this is a module DAO for Tavola
const mongoose = require('mongoose')
mongoose.pluralize(null);
const tavolaSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    tableName : String,
   telegramId: Number,
    partecipanti: [Number],
    surname: String,
    admin: Boolean,
    launch: Boolean
})

module.exports = mongoose.model('Tavola', tavolaSchema) 