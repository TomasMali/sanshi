

const Prova = require('./provaModel')

const express = require('express')

const router = express.Router()

const mongoose = require('mongoose')




// First route, get all users   
router.get('/', (req, res, next) => {
    const id = req.body.telegramId;
    Prova.find()
        .exec().
        then(doc => {
            console.log(doc)
            res.status(200).json({
                message: doc
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })

})




// POST REQUEST
router.post('/insert', (req, res, next) => {
 
console.log(req.body)
    const prova_ = new Prova({
        _id: new mongoose.Types.ObjectId(),
        telegramId: req.body.telegramId,
        name: req.body.name,
        surname: req.body.surname,
        admin: req.body.admin,
        launch : req.body.launch
      
      });
      prova_.save()
          .then(result => {
              console.log("Tavola " + result + " inserted correctly!")
              res.status(200).json({
                  message: " inserted correctly!",
              });
          })
          .catch(err => {
              console.log(err)
              res.status(500).json({ error: err })
          });

})





module.exports = router;