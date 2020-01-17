// This file is for handling request
const express = require('express')
const app = express();

const bodyParser = require('body-parser')

// improve productivity on development
const morgan = require('morgan')

const users = require('./api/routs/users/user')
const tavola = require('./api/routs/tavola/tavola')
const visiting = require('./api/routs/visiting/visiting')
const menu = require('./api/routs/menu/menu')
const prova = require('./api/routs/prova')


const mongoose = require('mongoose')


mongoose.connect('mongodb+srv://sushi:sushi@clustersushi-erhzq.mongodb.net/sushi?retryWrites=true&w=majority',
 { useNewUrlParser: true }, function(error) {
  // if error is truthy, the initial connection failed.
  console.log(error);
})


// improve productivity on development
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header("Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding")
    if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE')
    return res.status(200).json({})
    }
    next()
})


// just go to the ather file if you pass me ...
app.use('/users',users);
app.use('/Tavola',tavola)
app.use('/Visiting',visiting)
app.use('/menu',menu)
app.use('/prova',prova)


// if the user requires a path that doesnt exsists, i throw an error
app.use((req,ser,next)=>{
const error = new Error("Not found")
error.status = 404
next(error) // forword the request throut the appication
});

// i catch it here
app.use((error, req,res,next)=>{
   res.status(error.status || 500);
   res.json({
       error: {
           message: error.message
       }
   })
})


module.exports = app;
