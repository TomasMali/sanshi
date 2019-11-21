

const Menu = require('./menuModel')
const User = require('../users/userModel')

const express = require('express')

const router = express.Router()

const mongoose = require('mongoose')

const request = require('request')

const axios = require('axios');



// First route, get all Menu
router.get('/', (req, res, next) => {
  //  const id = req.params.telegramId;
    Menu.find()
        .exec().
        then(doc => {
            if(doc.length){
             //   console.log(doc.length)
                res.status(200).json({
                    message: doc
                })
            }
            else
            res.status(200).json({
                message: false
            })
       
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })

})




/**
 * Gets only one Menu
 * to be called with http://localhost:3000/menu/getMenu/25
 */
router.get('/getMenu/:menuId', (req, res, next) => {
    const id = req.params.menuId;

    Menu.find({ menuId: id }).exec().then(docs => {

        // if exsists than the user doesn't have the table set yet
        if (docs.length) {
            res.status(404)
                .json({ message: docs });
        }
        else
            res.status(404)
                .json({ message: docs });

    })
});


/**
 *  POST REQUEST Inserisce un menu solo se non esiste. 
 * // Da chimare http://localhost:3000/menu/insert
 * {
	"menuId" : 22,
	"name" : "sanshi riso",
	"portion" : 2,
	"price" : 6
}
 */
router.post('/insert', (req, res, next) => {
    const menuId = req.body.menuId;
    const name = req.body.name;
    const portion = req.body.portion;
    const price = req.body.price;
    Menu.find({ menuId: menuId }, function (err, docs) {
        if (docs.length) {
            res.status(404)
                .json({ message: "Menu esistente, inserisci un altro nome!" });
        } else {
            const Menu_ = new Menu({
                //      _id: new mongoose.Types.ObjectId(),
                menuId: req.body.menuId,
                name: req.body.name,
                portion: req.body.portion,
                price: req.body.price
            });
            Menu_.save()
                .then(result => {
              //      console.log("Menu " + result + " inserted correctly!")
                    res.status(200).json({
                        message: " inserted correctly!",
                    });
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({ error: err })
                });

        }
    });

})

module.exports = router;