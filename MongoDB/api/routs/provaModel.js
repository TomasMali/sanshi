


// this is a module DAO for Tavola
const mongoose = require('mongoose')
mongoose.pluralize(null);

const provaSchema = mongoose.Schema({
    telegramId: Number,
    name: String,
    surname: String,
    admin: Boolean,
    launch: Boolean

})

module.exports = mongoose.model('Prova', provaSchema) 